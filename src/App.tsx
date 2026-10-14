import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/Home";

// The homepage ships in the main bundle; other pages load on demand.
const OntoCampusPage = lazy(() => import("./pages/OntoCampus").then((m) => ({ default: m.OntoCampusPage })));
const OntoCandidatePage = lazy(() => import("./pages/OntoCandidate").then((m) => ({ default: m.OntoCandidatePage })));
const NetworkPage = lazy(() => import("./pages/Network").then((m) => ({ default: m.NetworkPage })));
const AboutPage = lazy(() => import("./pages/About").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("./pages/Contact").then((m) => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFoundPage })));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* Merged pages: keep their old addresses working. */}
          <Route path="vision" element={<Navigate to="/about" replace />} />
          <Route path="founding-universities" element={<Navigate to="/ontocampus#founding" replace />} />
          {/* Pages from the previous ontographica.com site. */}
          <Route path="contact.html" element={<Navigate to="/contact" replace />} />
          <Route path="services.html" element={<Navigate to="/" replace />} />
          <Route path="ontocanvas.html" element={<Navigate to="/" replace />} />
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route path="ontocampus" element={<OntoCampusPage />} />
          <Route path="ontocandidate" element={<OntoCandidatePage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          {/* The terms page was removed: the site has no accounts or services for terms to govern. */}
          <Route path="terms" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
