import { SpiralMark } from "./SpiralMark";

export type Product = "campus" | "candidate";

const products: Record<Product, { name: string; color: string }> = {
  // Logo colours, taken from the OntoCampus and OntoCandidate wordmarks.
  campus: { name: "Campus", color: "#4A7BF7" },
  candidate: { name: "Candidate", color: "#F2B630" },
};

type ProductLockupProps = {
  product: Product;
  className?: string;
};

/** "Onto" + product name, set with the spiral standing in for the O. Size with font-size. */
export function ProductLockup({ product, className = "" }: ProductLockupProps) {
  const { name, color } = products[product];
  return (
    <span
      className={`inline-flex items-center leading-none tracking-[-0.03em] ${className}`}
      aria-label={`Onto${name}`}
      role="img"
    >
      <SpiralMark color={color} className="mr-[0.04em] h-[1.18em] w-[1.18em] translate-y-[0.06em]" />
      <span aria-hidden="true" className="font-extrabold">
        nto
      </span>
      <span aria-hidden="true" className="font-light">
        {name}
      </span>
    </span>
  );
}

const productNames: Record<string, Product> = { OntoCampus: "campus", OntoCandidate: "candidate" };

/**
 * Renders text with every "OntoCampus" / "OntoCandidate" swapped for its logo lockup, sized to the
 * surrounding type. Each lockup keeps its name as its accessible label.
 */
export function Wordmarks({ text }: { text: string }) {
  return (
    <>
      {text.split(/(OntoCampus|OntoCandidate)/).map((part, index) =>
        productNames[part] ? (
          <ProductLockup key={index} product={productNames[part]} className="mx-[0.04em] align-[-0.12em] text-[1.04em]" />
        ) : (
          part
        ),
      )}
    </>
  );
}
