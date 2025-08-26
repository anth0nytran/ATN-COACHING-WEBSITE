"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <section className="section-padding">
          <div className="container-max text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-300 mb-6">An unexpected error occurred. Try again or go home.</p>
            <div className="flex items-center justify-center gap-3">
              <button className="valorant-button" onClick={() => reset()}>Try again</button>
              <a className="valorant-button-outline" href="/">Go home</a>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}


