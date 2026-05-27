import { cn } from "@/lib/cn";

export function BrandMark({
    className,
    showSub = true,
}: {
    className?: string;
    showSub?: boolean;
}) {
    return (
          <div className={cn("flex items-center gap-2.5", className)}>
                  <BrandGlyph />
                  <div className="flex flex-col leading-none">
                          <span className="wx-display text-[17px] tracking-tight">
                                    <span className="wx-gradient-text">wellx</span>span>
                          </span>span>
                    {showSub ? (
                      <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-fg-muted mt-1">
                                  Pricing Engine
                      </span>span>
                    ) : null}
                  </div>div>
          </div>div>
        );
}

export function BrandGlyph({ size = 26 }: { size?: number }) {
    return (
          <svg
                  width={size}
                  height={size}
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  className="shrink-0"
                >
                <defs>
                        <linearGradient id="wx-glyph" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#fb9b35" />
                                  <stop offset="25%" stopColor="#f1517b" />
                                  <stop offset="55%" stopColor="#b43082" />
                                  <stop offset="80%" stopColor="#8431cb" />
                                  <stop offset="100%" stopColor="#35c5fc" />
                        </linearGradient>linearGradient>
                </defs>defs>
                <rect width="32" height="32" rx="8" fill="url(#wx-glyph)" />
                <path
                          d="M8 10h2.8l3.2 9.6L17.2 10H20l3.2 9.6L26.4 10H29L24.8 24h-2.6l-3.4-9.8L15.4 24h-2.6L8 10z"
                          fill="white"
                          fillRule="evenodd"
                        />
          </svg>svg>
        );
}
</div>
