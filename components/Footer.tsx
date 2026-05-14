

export default function Footer() {
    return (


        <footer
            className="w-full border-t border-solid border-black/10 bg-[var(--bg-background-muted)] pt-[clamp(40px,5vw,100px)] pb-[30px] mt-[clamp(40px,5vw,100px)]"
            role="contentinfo">
            <div
                className="container flex w-full max-w-full flex-col items-stretch md:items-end gap-[clamp(30px,4vw,80px)]">
                <div
                    className="flex w-full flex-col gap-6 sm:flex-row  items-center sm:justify-between">
                    <a href="index.php" className="block w-[218px] max-w-full shrink-0">
                        <img src="./images/logo-2.svg" alt="MyTravelGeek" width="218" height="75" className="h-full w-full object-contain" />
                    </a>
                    <div className="flex flex-wrap items-center gap-[15px]">
                        <a
                            href="#"
                            className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[var(--main-primary)] text-white transition-opacity hover:opacity-90"
                            aria-label="Facebook"
                            rel="noopener noreferrer">
                            <i className="ti ti-brand-facebook text-xl leading-none"></i>
                        </a>
                        <a
                            href="#"
                            className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[var(--primary-400)] text-white transition-opacity hover:opacity-90"
                            aria-label="Instagram"
                            rel="noopener noreferrer">
                            <i className="ti ti-brand-instagram text-xl leading-none"></i>
                        </a>
                        <a
                            href="#"
                            className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[var(--primary-400)] text-white transition-opacity hover:opacity-90"
                            aria-label="X"
                            rel="noopener noreferrer">
                            <i className="ti ti-brand-x text-xl leading-none"></i>
                        </a>
                        <a
                            href="#"
                            className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[var(--primary-400)] text-white transition-opacity hover:opacity-90"
                            aria-label="LinkedIn"
                            rel="noopener noreferrer">
                            <i className="ti ti-brand-linkedin text-xl leading-none"></i>
                        </a>
                    </div>
                </div>
                <div
                    className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-center text-sm font-normal text-zinc-600 sm:text-left order-2 sm:order-1">
                        Copyright © {new Date().getFullYear()} MyTravelGeek. All Rights Reserved
                    </p>
                    <div
                        className="flex flex-wrap items-center justify-center gap-5 sm:justify-end order-1 sm:order-2">
                        <a
                            href="#"
                            className="text-center text-sm font-normal text-zinc-600 underline decoration-zinc-600 underline-offset-2 transition-colors hover:text-zinc-900">Privacy Policy</a>
                        <a
                            href="#"
                            className="text-center text-sm font-normal text-zinc-600 underline decoration-zinc-600 underline-offset-2 transition-colors hover:text-zinc-900">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>

    )
};