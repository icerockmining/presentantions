import { SITE_URL, COMPANY, abs } from "./site";
import type { ProductWithRel } from "./queries";

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data),
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY.legalName,
    alternateName: COMPANY.brand,
    url: SITE_URL,
    logo: abs("/logo-wordmark.svg"),
    telephone: `+${COMPANY.phoneHref.replace(/\D/g, "")}`,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address,
      addressLocality: COMPANY.city,
      postalCode: COMPANY.postalCode,
      addressCountry: "RU",
    },
  };
}

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: COMPANY.legalName,
    image: abs("/logo-wordmark.svg"),
    url: SITE_URL,
    telephone: `+${COMPANY.phoneHref.replace(/\D/g, "")}`,
    email: COMPANY.email,
    priceRange: "₽₽₽",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address,
      addressLocality: COMPANY.city,
      postalCode: COMPANY.postalCode,
      addressCountry: "RU",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY.brand,
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/catalog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}

export function productLd(p: ProductWithRel) {
  const availability =
    p.stockLocation === "moscow" ? "https://schema.org/InStock" : "https://schema.org/BackOrder";

  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.seoDescription || p.subtitle || p.name,
    sku: p.sku || p.slug,
    category: p.category.name,
    brand: { "@type": "Brand", name: p.vendor.name },
    url: abs(`/product/${p.slug}`),
  };

  // Google requires Product.image for rich results. When a product has no uploaded
  // images, fall back to its dynamic OG image so `image` is always present.
  if (p.images && p.images.length) {
    base.image = p.images.map((i) => abs(i));
  } else {
    base.image = abs(`/product/${p.slug}/opengraph-image`);
  }

  // For price === null we do NOT emit a price (invalid for Google).
  if (p.price != null) {
    base.offers = {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: p.price,
      priceValidUntil: priceValidUntil.toISOString().slice(0, 10),
      availability,
      itemCondition: "https://schema.org/NewCondition",
      url: abs(`/product/${p.slug}`),
      seller: { "@id": `${SITE_URL}/#organization` },
    };
  } else {
    base.offers = {
      "@type": "Offer",
      priceCurrency: "RUB",
      availability,
      itemCondition: "https://schema.org/NewCondition",
      url: abs(`/product/${p.slug}`),
      seller: { "@id": `${SITE_URL}/#organization` },
    };
  }

  return base;
}

export function itemListLd(products: { slug: string; name: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/product/${p.slug}`),
      name: p.name,
    })),
  };
}

export function blogPostingLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.publishedAt.toISOString(),
    url: abs(`/blog/${post.slug}`),
    inLanguage: "ru-RU",
    author: { "@type": "Organization", name: COMPANY.brand },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(data)} />
  );
}
