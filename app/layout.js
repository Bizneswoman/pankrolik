import './globals.css'
import { Providers } from './providers'

const LOGO = 'https://customer-assets.emergentagent.com/job_elegant-rabbit/artifacts/x9lrj07c_D9632737-1F44-45B4-A7C0-9C441DE67080.PNG'

export const metadata = {
  title: 'Pan Królik – Restauracja | Dobry smak to sztuka',
  description: 'Pan Królik – ekskluzywna restauracja premium. Miejsce stworzone z pasji do wyjątkowej kuchni oraz niezapomnianej atmosfery. Zarezerwuj stolik już dziś.',
  keywords: ['restauracja', 'Pan Królik', 'fine dining', 'kuchnia premium', 'rezerwacja stolika', 'restauracja premium'],
  icons: {
    icon: LOGO,
    shortcut: LOGO,
    apple: LOGO,
  },
  openGraph: {
    title: 'Pan Królik – Restauracja | Dobry smak to sztuka',
    description: 'Ekskluzywna restauracja premium. Miejsce stworzone z pasji do wyjątkowej kuchni oraz niezapomnianej atmosfery.',
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Pan Królik',
    images: [{ url: LOGO, width: 1200, height: 1200, alt: 'Pan Królik Restauracja' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pan Królik – Restauracja',
    description: 'Dobry smak to sztuka.',
    images: [LOGO],
  },
}

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Pan Królik',
  image: LOGO,
  servesCuisine: ['Polska', 'Europejska', 'Fine dining'],
  priceRange: '$$$',
  slogan: 'Dobry smak to sztuka',
  acceptsReservations: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href={LOGO} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }} />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
