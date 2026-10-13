import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { cta, navigation, routes } from "../../content/site";
import { OntographicaLogo } from "../brand/OntographicaLogo";
import { Wordmarks } from "../brand/ProductLockup";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // Scroll state from an IntersectionObserver sentinel (no scroll listeners).
  useEffect(() => {
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        ref={sentinel}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 h-2 w-full"
      />
      <header className="sticky top-0 z-50 h-[68px] pt-2">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Container>
          <div
            className={`glass relative flex h-[52px] items-center justify-between gap-6 rounded-card border pr-1.5 pl-5 transition-[border-color,box-shadow,background-color] duration-500 ${
              scrolled || open
                ? "border-white/[0.1] shadow-[0_20px_50px_-24px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.06)]"
                : "border-white/[0.06] !bg-[rgb(5_7_11/0.35)]"
            }`}
          >
            <Link
              to={routes.home}
              className="-m-2 p-2 text-fg"
              aria-label="Ontographica home"
            >
              <OntographicaLogo className="h-[1.3rem] w-auto" />
            </Link>

            <nav
              aria-label="Primary"
              className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
            >
              <ul className="flex items-center gap-1">
                {navigation.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className="rounded-control px-3.5 py-2 text-[0.88rem] text-fg-muted transition-colors duration-300 hover:text-fg aria-[current=page]:bg-white/[0.07] aria-[current=page]:text-fg"
                    >
                      <Wordmarks text={item.label} />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <ButtonLink
                  to={cta.contact.to}
                  variant="brand"
                  className="!min-h-10 px-4 text-[0.88rem]"
                >
                  {cta.contact.label}
                </ButtonLink>
              </span>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-control text-fg lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen((value) => !value)}
              >
                <span className="sr-only">
                  {open ? "Close menu" : "Open menu"}
                </span>
                <Icon name={open ? "close" : "menu"} size={24} />
              </button>
            </div>
          </div>
        </Container>

        <div
          id="mobile-navigation"
          hidden={!open}
          className="fixed inset-x-0 top-[68px] bottom-0 overflow-y-auto bg-bg lg:hidden"
        >
          <Container className="py-6">
            <nav aria-label="Mobile">
              <ul className="border-t border-line">
                {[{ label: "Home", to: routes.home }, ...navigation].map(
                  (item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === routes.home}
                        className="block border-b border-line py-4 text-[1.75rem] font-medium tracking-[-0.03em] text-fg-soft aria-[current=page]:text-fg"
                      >
                        <Wordmarks text={item.label} />
                      </NavLink>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <ButtonLink to={cta.contact.to} variant="brand" arrow className="mt-8 w-full">
              {cta.contact.label}
            </ButtonLink>
          </Container>
        </div>
      </header>
    </>
  );
}
