export const profile = {
  name: 'Willy Wario',
  role: 'Full-Stack Developer',
  location: 'Kigali, Rwanda',
  email: 'willywario0@gmail.com',
  phone: '+250 796 888 743',
  phoneHref: 'tel:+250796888743',
  whatsapp: 'https://wa.me/254795847919',
  github: 'https://github.com/willy3000',
  linkedin: 'https://www.linkedin.com/in/willy-wario-6833021a6',
  resume: '/files/resume-wario.pdf',
};

export const facts = [
  { label: 'Experience', value: '5+ years' },
  { label: 'Client side', value: 'React · Next.js · TypeScript' },
  { label: 'Server side', value: 'Node.js · Express · REST' },
  { label: 'Based in', value: 'Kigali, Rwanda' },
];

export const projects = [
  {
    id: 'pixel-realm',
    size: 'full',
    title: 'Pixel Realm V2',
    context: 'Digital Realm Entertainment',
    period: '2026',
    status: 'Live',
    summary:
      'A marketplace for African digital assets, where 2D and 3D packs for games, film and XR are bought and sold. It spans an admin portal, storefront and landing page, built in Next.js and TypeScript on a Laravel REST API.',
    tags: ['Next.js', 'TypeScript', 'TipTap', 'Laravel API'],
    url: 'store.pixel-realm.net',
    image: { src: '/images/pixel-realm.jpg', width: 1920, height: 900 },
    links: [{ label: 'Visit store', href: 'https://store.pixel-realm.net/' }],
    note: 'Private codebase',
  },
  {
    id: 'tenzibiz',
    size: 'full',
    title: 'TenziBiz',
    context: 'TenziLabs',
    period: '2022 – 2023',
    summary:
      'A business management platform for small and medium enterprises: point of sale, sales, inventory, ordering and reporting in one web app.',
    tags: ['React', 'Next.js', 'Material UI', 'Firebase'],
    url: 'biz.tenzi.africa',
    image: { src: '/images/tenzibizapp.png', width: 1880, height: 857 },
    links: [{ label: 'Visit site', href: 'https://biz.tenzi.africa' }],
    note: 'Company codebase',
  },
  {
    id: 'mibm',
    size: 'half',
    title: 'MIBM Inventory',
    context: 'MIBM',
    period: '2024',
    summary:
      'A multi-user inventory system that tracks hardware, employee assignments and item status, with role-based permissions, barcode intake, audit logs and tiered subscriptions paid through Paystack and M-Pesa.',
    tags: ['Next.js', 'Express', 'Tailwind CSS', 'Cloudinary', 'Paystack'],
    url: 'inventory-project-mibm.netlify.app',
    image: { src: '/images/mibm-inventory.png', width: 1919, height: 896 },
    links: [
      { label: 'Live demo', href: 'https://inventory-project-mibm.netlify.app/dashboard/users' },
      { label: 'Source code', href: 'https://github.com/willy3000/inventory-project' },
    ],
  },
  {
    id: 'hanawari',
    size: 'half',
    title: 'Hanawari',
    context: 'Independent',
    period: 'E-commerce',
    summary:
      'An online store for a homemade Kenyan salsa brand, covering the storefront, product catalogue and transactional email sent through Resend on a verified domain.',
    tags: ['Next.js', 'Resend'],
    url: 'hanawari-web.netlify.app',
    image: { src: '/images/hanawari.jpg', width: 1920, height: 900 },
    links: [{ label: 'Visit store', href: 'https://hanawari-web.netlify.app/' }],
  },
];

export const experience = [
  {
    company: 'Digital Realm Entertainment',
    role: 'Full-Stack Developer',
    location: 'Kigali, Rwanda',
    period: 'Apr 2026 – Present',
    current: true,
    highlights: [
      'Build and maintain Pixel Realm V2, a Next.js and TypeScript marketplace spanning an admin portal, storefront and landing page on a Laravel REST API.',
      'Migrated rich-text editing from React Quill to TipTap and carried out a major Next.js upgrade without regressing existing features.',
      'Resolved authentication-flow defects, SSR hydration errors and theme flashes, improving first-load stability.',
      'Authored a data-protection and security audit checklist covering both the frontend and the Laravel backend.',
    ],
  },
  {
    company: 'MIBM',
    role: 'IT Support Intern',
    location: 'Nairobi, Kenya',
    period: 'Sep 2024 – Dec 2024',
    highlights: [
      'Built an in-house tech inventory system with Next.js and Express that tracks hardware, employee assignments, item status and audit logs.',
      'Monitored system performance and cleared network bottlenecks to keep services available.',
    ],
  },
  {
    company: 'TenziLabs',
    role: 'Junior Frontend Developer',
    location: 'Nairobi, Kenya',
    period: 'Sep 2022 – Sep 2023',
    highlights: [
      'Maintained and extended a production React and TypeScript application across releases.',
      'Delivered the company website and TenziBiz, a business management web app, both built with Next.js.',
      'Worked directly with designers to ship new UI, and fixed defects affecting performance and reliability.',
    ],
  },
  {
    company: 'NHIF',
    role: 'Software Developer',
    location: 'Nairobi, Kenya',
    period: 'Jan 2022 – May 2022',
    highlights: [
      'Designed an object-oriented Python system that cleanses large Excel datasets, removing duplicate and invalid ID records before pushing them to the main database over REST APIs.',
      'Maintained it on cloud infrastructure as record volumes grew.',
    ],
  },
];

export const education = [
  { school: 'KCA University', program: 'BSc, Software Development', period: '2019 – 2024' },
  { school: 'Moringa School', program: 'Software Engineering', period: '2023 – 2024' },
];

export const strengths = [
  {
    icon: 'migrate',
    title: 'Framework migrations',
    text: 'Major Next.js upgrades and editor migrations that modernise a codebase without breaking what already works.',
  },
  {
    icon: 'debug',
    title: 'Rendering and auth debugging',
    text: 'Hydration errors, theme flashes and broken sign-in flows, traced to the root cause and fixed for good.',
  },
  {
    icon: 'data',
    title: 'Data-processing systems',
    text: 'Pipelines that cleanse and validate large datasets before a single record reaches the database.',
  },
  {
    icon: 'interface',
    title: 'Design to interface',
    text: 'Turning design specifications into interfaces that are stable, accessible and easy to maintain.',
  },
];

export const toolkit = [
  { label: 'Languages', items: 'TypeScript, JavaScript, Python, C#, SQL' },
  { label: 'Frontend', items: 'React, Next.js, React Native, HTML, CSS, component libraries' },
  { label: 'Backend & APIs', items: 'Node.js, Express, .NET, REST API design and integration' },
  { label: 'Databases', items: 'MongoDB, Firebase' },
  { label: 'Tools', items: 'Git, Yarn, npm, Linux, cloud platforms' },
];
