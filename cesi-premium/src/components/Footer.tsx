export default function Footer() {
    return (
        <footer className="border-t border-border py-12 bg-background">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative h-10 w-48">
                    <img src="/img/logo.svg" alt="CESI Premium" className="h-full w-auto object-contain" />
                </div>
                <p className="text-text-secondary text-sm">
                    © {new Date().getFullYear()} CESI Premium. Fait avec passion pour les étudiants.
                </p>
                <div className="flex gap-6">
                    <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Confidentialité</a>
                    <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Conditions</a>
                </div>
            </div>
        </footer>
    );
}
