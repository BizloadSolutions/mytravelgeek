import { Metadata } from "next";

export default function TermsService() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full">
        <div className="flex min-h-[221px] w-full flex-col items-center justify-center gap-2 bg-[var(--primary-50)] px-4 py-10 sm:gap-4 sm:py-12">
          <h1 className="text-center text-2xl font-semibold text-text-color sm:text-3xl md:text-4xl lg:text-5xl">
            Terms of Service
          </h1>

          <p className="max-w-[440px] text-center text-base font-normal">
            Please review the terms and conditions for using our AI-powered
            travel platform.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full">
        <div className="container pt-10 lg:pt-12">
          <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-9">
            {/* Introduction */}
            <article className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold md:text-2xl">
                Introduction
              </h2>

              <p className="text-sm font-normal leading-relaxed text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </article>

            {/* Security Terms */}
            <article className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold md:text-2xl">
                Security Terms of Use
              </h2>

              <div className="flex flex-col gap-3.5">
                <p className="text-sm font-normal leading-relaxed text-zinc-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>

                <ol className="flex list-decimal flex-col gap-3.5 pl-6 text-sm leading-relaxed text-zinc-600">
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>

                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>

                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>
                </ol>
              </div>
            </article>

            {/* Website Usage */}
            <article className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold md:text-2xl">
                Website Usage & Privacy
              </h2>

              <p className="text-sm font-normal leading-relaxed text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
