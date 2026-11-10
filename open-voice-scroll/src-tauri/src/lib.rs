use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};

pub struct AudioState {
    pub is_running: Arc<AtomicBool>,
    pub mic_level: Arc<AtomicU32>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AudioDeviceInfo {
    pub name: String,
    pub is_default: bool,
}

#[tauri::command]
fn get_audio_devices() -> Vec<AudioDeviceInfo> {
    let host = cpal::default_host();
    let mut devices = Vec::new();
    let default_device_name = host.default_input_device().and_then(|d| d.name().ok());

    if let Ok(input_devices) = host.input_devices() {
        for device in input_devices {
            if let Ok(name) = device.name() {
                let is_default = default_device_name.as_ref() == Some(&name);
                devices.push(AudioDeviceInfo { name, is_default });
            }
        }
    }
    devices
}

#[tauri::command]
fn start_native_audio(app: AppHandle, state: State<'_, AudioState>) -> Result<String, String> {
    if state.is_running.load(Ordering::SeqCst) {
        return Ok("Already running".into());
    }

    let host = cpal::default_host();
    let device = host
        .default_input_device()
        .ok_or_else(|| "Aucun périphérique audio d'entrée trouvé".to_string())?;

    let config = device
        .default_input_config()
        .map_err(|e| format!("Erreur configuration micro: {e}"))?;

    let is_running = state.is_running.clone();
    let mic_level = state.mic_level.clone();
    is_running.store(true, Ordering::SeqCst);

    let err_fn = move |err| {
        eprintln!("Erreur flux audio natif: {}", err);
    };

    let channels = config.channels();
    let sample_rate = config.sample_rate().0;

    let app_handle = app.clone();
    let is_running_clone = is_running.clone();
    let mic_level_clone = mic_level.clone();

    std::thread::spawn(move || {
        let stream = match config.sample_format() {
            cpal::SampleFormat::F32 => device.build_input_stream(
                &config.into(),
                move |data: &[f32], _: &_| {
                    if !is_running_clone.load(Ordering::Relaxed) {
                        return;
                    }
                    let mut sum_sq = 0.0f32;
                    let count = data.len();
                    if count > 0 {
                        for &sample in data {
                            sum_sq += sample * sample;
                        }
                        let rms = (sum_sq / count as f32).sqrt();
                        let level = (rms * 400.0).min(100.0).round() as u32;
                        mic_level_clone.store(level, Ordering::Relaxed);
                        let _ = app_handle.emit("native_mic_level", level);
                    }
                },
                err_fn,
                None,
            ),
            _ => Err(cpal::BuildStreamError::DeviceNotAvailable),
        };

        if let Ok(stream) = stream {
            if let Ok(_) = stream.play() {
                while is_running.load(Ordering::Relaxed) {
                    std::thread::sleep(std::time::Duration::from_millis(50));
                }
            }
        }
        is_running.store(false, Ordering::SeqCst);
    });

    Ok(format!("Capteur audio natif actif: {} Hz, {} canaux", sample_rate, channels))
}

#[tauri::command]
fn stop_native_audio(state: State<'_, AudioState>) -> Result<String, String> {
    state.is_running.store(false, Ordering::SeqCst);
    state.mic_level.store(0, Ordering::Relaxed);
    Ok("Micro natif arrêté".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AudioState {
            is_running: Arc::new(AtomicBool::new(false)),
            mic_level: Arc::new(AtomicU32::new(0)),
        })
        .invoke_handler(tauri::generate_handler![
            get_audio_devices,
            start_native_audio,
            stop_native_audio,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
