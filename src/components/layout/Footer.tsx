import { Link } from "react-router";
import { company, cta, navigation, routes } from "../../content/site";
import { OntographicaLogo } from "../brand/OntographicaLogo";
import { Wordmarks } from "../brand/ProductLockup";
import { Container } from "../ui/Container";

const quiet = "text-fg-muted transition-colors hover:text-fg";
const links = [...navigation, cta.contact];

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <Container className="pt-16 pb-10 lg:pt-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to={routes.home} className="inline-block text-fg" aria-label="Ontographica home">
              <OntographicaLogo className="h-6 w-auto" />
            </Link>
            <p className="mt-6 text-[1.15rem] leading-snug tracking-[-0.01em] text-fg-soft">{company.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-fg transition-colors hover:text-fg-muted">
                    <Wordmarks text={link.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-fg-muted">
            <span>&copy; {new Date().getFullYear()} Ontographica</span>
            <Link to={routes.privacy} className={quiet}>
              Privacy Policy
            </Link>
          </p>
          <a href={`mailto:${company.email}`} className={quiet}>
            {company.email}
          </a>
        </div>
      </Container>
    </footer>
  );
}
