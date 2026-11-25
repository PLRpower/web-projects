export function CCTLSourceImage({ src, alt }: { src: string; alt: string }) {
    // PDF crops are generated locally and already sized for display.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="block max-w-full h-auto rounded bg-white" />;
}
