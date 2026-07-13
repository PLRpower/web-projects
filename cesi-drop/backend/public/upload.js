const files = document.querySelector('input[type="file"]')
FilePond.registerPlugin(FilePondPluginImagePreview)

// Create a FilePond instance and post files to /upload
FilePond.create(files, {
  labelIdle:
    'Glissez et déposez vos fichiers ou <span class="filepond--label-action">parcourez</span>',
  server: '/publier/post',
})
