import { v4 as uuidv4 } from 'uuid'
import { GALLERY_BASE64 } from './gallery-images'
import { ABOUT_BASE64 } from './brand-images'
import { HERO_BASE64 } from './hero-image'

// ---- Image pools (easy to swap later via admin) ----
const I = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzgyOTgwMzQzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1744776411221-702f2848b0b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzgyOTgwMzQzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1502920764203-b859c2384716?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzgyOTgwMzQzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1679312061521-d7d619a8cfb7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzgyOTgwMzQzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/10633476/pexels-photo-10633476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/11906266/pexels-photo-11906266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1574966739987-65e38db0f7ce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwzfHxmaW5lJTIwZGluaW5nJTIwYW1iaWFuY2V8ZW58MHx8fHwxNzgyOTgwMzQzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1706820229870-f9a8c6dac193?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbXxlbnwwfHx8fDE3ODI5ODAzNDh8MA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/1327369/pexels-photo-1327369.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/14598479/pexels-photo-14598479.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwYW1iaWFuY2V8ZW58MHx8fHwxNzgyOTgwMzQzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1704040686487-a39bb894fc93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHw0fHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbXxlbnwwfHx8fDE3ODI5ODAzNDh8MA&ixlib=rb-4.1.0&q=85',
]

const F = [
  'https://images.unsplash.com/photo-1616671285410-2a676a9a433d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwzfHxnb3VybWV0JTIwcGxhdGVkJTIwZGlzaHxlbnwwfHx8fDE3ODI5ODAzOTF8MA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1663530761401-15eefb544889?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGxhdGVkJTIwZGlzaHxlbnwwfHx8fDE3ODI5ODAzOTF8MA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwcGxhdGVkJTIwZGlzaHxlbnwwfHx8fDE3ODI5ODAzOTF8MA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1676471926534-d5c9771909fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHw0fHxnb3VybWV0JTIwcGxhdGVkJTIwZGlzaHxlbnwwfHx8fDE3ODI5ODAzOTF8MA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/1327393/pexels-photo-1327393.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/23644633/pexels-photo-23644633.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwZm9vZHxlbnwwfHx8fDE3ODI5ODAzOTB8MA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1611520175743-30ff00129621?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxmaW5lJTIwZGluaW5nJTIwZm9vZHxlbnwwfHx8fDE3ODI5ODAzOTB8MA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY29ja3RhaWx8ZW58MHx8fHwxNzgyOTgwMzkxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwyfHxkZXNzZXJ0JTIwY29ja3RhaWx8ZW58MHx8fHwxNzgyOTgwMzkxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1492683513054-55277abccd99?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwzfHxkZXNzZXJ0JTIwY29ja3RhaWx8ZW58MHx8fHwxNzgyOTgwMzkxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxwYXN0YSUyMGRpc2h8ZW58MHx8fHwxNzgyOTgwNDAxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/5531093/pexels-photo-5531093.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyfGVufDB8fHx8MTc4Mjk4MDQwMXww&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/15010285/pexels-photo-15010285.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
]

export const DEFAULT_CONTENT = {
  id: 'site',
  hero: {
    title: 'Dobry smak to sztuka',
    title_en: 'Good taste is an art',
    subtitle: 'Miejsce stworzone z pasji do wyjątkowej kuchni oraz niezapomnianej atmosfery.',
    subtitle_en: 'A place created out of passion for exceptional cuisine and an unforgettable atmosphere.',
    backgroundImage: HERO_BASE64,
  },
  about: {
    title: 'O restauracji',
    title_en: 'About the restaurant',
    text: 'Pan Królik to restauracja, w której tradycja spotyka się z nowoczesnością. Każde danie tworzymy z pasją, dbając o najwyższą jakość składników i wyjątkową prezentację.\n\nNasze wnętrze łączy elegancję z ciepłą atmosferą, dzięki czemu każda wizyta staje się niezapomnianym przeżyciem kulinarnym. Zapraszamy do świata smaków Pana Królika.',
    text_en: 'Pan Królik is a restaurant where tradition meets modernity. We craft every dish with passion, caring about the highest quality of ingredients and exceptional presentation.\n\nOur interior blends elegance with a warm atmosphere, making every visit an unforgettable culinary experience. Welcome to the world of flavours of Pan Królik.',
    image: ABOUT_BASE64,
    features: [
      { icon: 'Leaf', title: 'Świeże składniki', title_en: 'Fresh ingredients' },
      { icon: 'MapPin', title: 'Lokalne produkty', title_en: 'Local products' },
      { icon: 'Sparkles', title: 'Wyjątkowa atmosfera', title_en: 'Unique atmosphere' },
      { icon: 'ConciergeBell', title: 'Profesjonalna obsługa', title_en: 'Professional service' },
    ],
  },
  contact: {
    address: 'Aleja Rzeczypospolitej 2a, 02-972 Warszawa',
    phone: '+48 787 147 007',
    email: 'kontakt@pankrolik.pl',
    hours: [
      { day: 'Poniedziałek', day_en: 'Monday', time: 'Zamknięte', time_en: 'Closed' },
      { day: 'Wtorek – Piątek', day_en: 'Tuesday – Friday', time: '12:00 – 19:00' },
      { day: 'Sobota – Niedziela', day_en: 'Saturday – Sunday', time: '14:00 – 20:00' },
    ],
    mapsEmbed: 'https://www.google.com/maps?q=Aleja%20Rzeczypospolitej%202a%2C%2002-972%20Warszawa&output=embed',
    mapsLink: 'https://www.google.com/maps/dir/?api=1&destination=Aleja+Rzeczypospolitej+2a,+02-972+Warszawa',
  },
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: '',
  },
  footer: {
    description: 'Restauracja Pan Królik – dobry smak to sztuka. Zapraszamy na wyjątkową podróż kulinarną w eleganckiej i kameralnej atmosferze.',
    description_en: 'Pan Królik Restaurant – good taste is an art. Join us for an exceptional culinary journey in an elegant and intimate atmosphere.',
  },
}

export function mkMenu() {
  const items = [
    // Przystawki
    { category: 'Przystawki', name: 'Carpaccio z polędwicy', name_en: 'Beef Tenderloin Carpaccio', description: 'Cienko krojona polędwica wołowa, rukola, płatki parmezanu, kapary i oliwa truflowa.', description_en: 'Thinly sliced beef tenderloin, rocket, parmesan shavings, capers and truffle oil.', price: '54 zł', image: F[0] },
    { category: 'Przystawki', name: 'Tatar wołowy', name_en: 'Beef Tartare', description: 'Klasyczny tatar z polędwicy, żółtko, korniszony, cebula i grzybki marynowane.', description_en: 'Classic tenderloin tartare, egg yolk, gherkins, onion and marinated mushrooms.', price: '58 zł', image: F[1] },
    { category: 'Przystawki', name: 'Krewetki w maśle czosnkowym', name_en: 'Garlic Butter Prawns', description: 'Krewetki tygrysie smażone na maśle z czosnkiem, chili i świeżą pietruszką.', description_en: 'Tiger prawns pan-fried in butter with garlic, chilli and fresh parsley.', price: '62 zł', image: F[3] },
    { category: 'Przystawki', name: 'Deska serów', name_en: 'Cheese Board', description: 'Wybór dojrzewających serów, konfitura z figi, orzechy i miód.', description_en: 'A selection of matured cheeses, fig jam, nuts and honey.', price: '69 zł', image: F[5] },
    // Zupy
    { category: 'Zupy', name: 'Krem z borowików', name_en: 'Porcini Cream Soup', description: 'Aksamitny krem z prawdziwych borowików z nutą trufli i grzankami.', description_en: 'Velvety porcini cream soup with a hint of truffle and croutons.', price: '32 zł', image: F[6] },
    { category: 'Zupy', name: 'Żurek staropolski', name_en: 'Old-Polish Sour Rye Soup', description: 'Tradycyjny żurek na zakwasie, biała kiełbasa i jajko, podawany w chlebie.', description_en: 'Traditional sourdough rye soup, white sausage and egg, served in bread.', price: '34 zł', image: F[4] },
    { category: 'Zupy', name: 'Rosół królewski', name_en: 'Royal Broth', description: 'Bogaty rosół z domowym makaronem i świeżymi ziołami.', description_en: 'Rich broth with homemade noodles and fresh herbs.', price: '28 zł', image: F[7] },
    // Dania główne
    { category: 'Dania główne', name: 'Polędwica wołowa', name_en: 'Beef Tenderloin', description: 'Grillowana polędwica z sosem demi-glace, pure ziemniaczane i warzywa sezonowe.', description_en: 'Grilled tenderloin with demi-glace sauce, potato purée and seasonal vegetables.', price: '98 zł', image: F[2] },
    { category: 'Dania główne', name: 'Konfitowana kaczka', name_en: 'Duck Confit', description: 'Udko kaczki konfitowane, modra kapusta i sos żurawinowy.', description_en: 'Confit duck leg, red cabbage and cranberry sauce.', price: '84 zł', image: F[7] },
    { category: 'Dania główne', name: 'Łosoś z grilla', name_en: 'Grilled Salmon', description: 'Filet z łososia, szpinak, sos cytrynowo-masłowy i szparagi.', description_en: 'Salmon fillet, spinach, lemon-butter sauce and asparagus.', price: '89 zł', image: F[6] },
    { category: 'Dania główne', name: 'Comber z jagnięciny', name_en: 'Rack of Lamb', description: 'Delikatny comber jagnięcy, sos rozmarynowy i ziemniaki fondant.', description_en: 'Tender rack of lamb, rosemary sauce and fondant potatoes.', price: '112 zł', image: F[0] },
    { category: 'Dania główne', name: 'Pierś z kaczki', name_en: 'Duck Breast', description: 'Różowa pierś kaczki, pure z selera i sos wiśniowy.', description_en: 'Pink duck breast, celeriac purée and cherry sauce.', price: '92 zł', image: F[1] },
    { category: 'Dania główne', name: 'Risotto z truflą', name_en: 'Truffle Risotto', description: 'Kremowe risotto z parmezanem i świeżą truflą.', description_en: 'Creamy risotto with parmesan and fresh truffle.', price: '76 zł', image: F[10] },
    // Pizza
    { category: 'Pizza', name: 'Margherita', name_en: 'Margherita', description: 'Sos pomidorowy San Marzano, mozzarella, świeża bazylia.', description_en: 'San Marzano tomato sauce, mozzarella, fresh basil.', price: '39 zł', image: F[2] },
    { category: 'Pizza', name: 'Prosciutto e Rucola', name_en: 'Prosciutto e Rucola', description: 'Mozzarella, prosciutto di Parma, rukola, parmezan.', description_en: 'Mozzarella, prosciutto di Parma, rocket, parmesan.', price: '49 zł', image: F[3] },
    { category: 'Pizza', name: 'Quattro Formaggi', name_en: 'Quattro Formaggi', description: 'Cztery sery: mozzarella, gorgonzola, parmezan, provolone.', description_en: 'Four cheeses: mozzarella, gorgonzola, parmesan, provolone.', price: '47 zł', image: F[5] },
    { category: 'Pizza', name: 'Diavola', name_en: 'Diavola', description: 'Pikantne salami, papryczki chili, mozzarella, sos pomidorowy.', description_en: 'Spicy salami, chilli peppers, mozzarella, tomato sauce.', price: '46 zł', image: F[0] },
    // Burgery
    { category: 'Burgery', name: 'Classic Beef', name_en: 'Classic Beef', description: 'Wołowina 200g, cheddar, sałata, pomidor, ogórek, sos własny.', description_en: '200g beef, cheddar, lettuce, tomato, pickle, house sauce.', price: '48 zł', image: F[12] },
    { category: 'Burgery', name: 'Pan Królik Burger', name_en: 'Pan Królik Burger', description: 'Podwójna wołowina, boczek, karmelizowana cebula, ser i sos BBQ.', description_en: 'Double beef, bacon, caramelised onion, cheese and BBQ sauce.', price: '56 zł', image: F[13] },
    { category: 'Burgery', name: 'Chicken Burger', name_en: 'Chicken Burger', description: 'Chrupiący kurczak, sałata, majonez chipotle, pikle.', description_en: 'Crispy chicken, lettuce, chipotle mayo, pickles.', price: '44 zł', image: F[12] },
    // Makarony
    { category: 'Makarony', name: 'Tagliatelle z truflą', name_en: 'Truffle Tagliatelle', description: 'Świeży makaron, sos śmietanowy, trufla i parmezan.', description_en: 'Fresh pasta, cream sauce, truffle and parmesan.', price: '58 zł', image: F[10] },
    { category: 'Makarony', name: 'Spaghetti Carbonara', name_en: 'Spaghetti Carbonara', description: 'Guanciale, żółtko, pecorino, świeżo mielony pieprz.', description_en: 'Guanciale, egg yolk, pecorino, freshly ground pepper.', price: '46 zł', image: F[11] },
    { category: 'Makarony', name: 'Pappardelle z ragout', name_en: 'Pappardelle with Ragout', description: 'Wolno duszone ragout wołowe z czerwonym winem.', description_en: 'Slow-braised beef ragout with red wine.', price: '54 zł', image: F[10] },
    { category: 'Makarony', name: 'Penne Arrabiata', name_en: 'Penne Arrabiata', description: 'Pikantny sos pomidorowy z czosnkiem i chili.', description_en: 'Spicy tomato sauce with garlic and chilli.', price: '42 zł', image: F[11] },
    // Desery
    { category: 'Desery', name: 'Tarta czekoladowa', name_en: 'Chocolate Tart', description: 'Kruche ciasto, ganache z gorzkiej czekolady, sól morska.', description_en: 'Shortcrust pastry, dark chocolate ganache, sea salt.', price: '29 zł', image: F[8] },
    { category: 'Desery', name: 'Crème brûlée', name_en: 'Crème brûlée', description: 'Krem waniliowy z chrupiącą karmelową skorupką.', description_en: 'Vanilla custard with a crisp caramel crust.', price: '27 zł', image: F[9] },
    { category: 'Desery', name: 'Sernik po wiedeńsku', name_en: 'Viennese Cheesecake', description: 'Puszysty sernik na kruchym spędzie z sosem malinowym.', description_en: 'Fluffy cheesecake on a shortcrust base with raspberry sauce.', price: '26 zł', image: F[9] },
    // Napoje
    { category: 'Napoje', name: 'Lemoniada domowa', name_en: 'Homemade Lemonade', description: 'Świeżo wyciskana cytryna, mięta i syrop trzcinowy.', description_en: 'Freshly squeezed lemon, mint and cane syrup.', price: '18 zł', image: F[9] },
    { category: 'Napoje', name: 'Wino czerwone (kieliszek)', name_en: 'Red Wine (glass)', description: 'Starannie wyselekcjonowane wino wytrawne.', description_en: 'A carefully selected dry wine.', price: '24 zł', image: F[7] },
    { category: 'Napoje', name: 'Koktajl Pan Królik', name_en: 'Pan Królik Cocktail', description: 'Autorski koktajl na bazie gin, cytrusów i ziół.', description_en: 'Signature cocktail based on gin, citrus and herbs.', price: '32 zł', image: F[8] },
  ]
  return items.map((it, idx) => ({ id: uuidv4(), order: idx, ...it }))
}

export function mkGallery() {
  const urls = [...I, F[0], F[1], F[2], F[3], F[6], F[8], F[10], F[12]]
  return urls.map((url, idx) => ({ id: uuidv4(), url, order: idx }))
}

export function mkReviews() {
  return [
    { id: uuidv4(), name: 'Anna Kowalska', rating: 5, text: 'Wyjątkowe miejsce! Każde danie to prawdziwe dzieło sztuki. Obsługa na najwyższym poziomie.', text_en: 'An exceptional place! Every dish is a true work of art. Service at the highest level.' },
    { id: uuidv4(), name: 'Marek Nowak', rating: 5, text: 'Elegancki wystrój i niesamowite smaki. Polędwica wołowa rozpływała się w ustach. Wrócimy!', text_en: 'Elegant decor and amazing flavours. The beef tenderloin melted in the mouth. We will be back!' },
    { id: uuidv4(), name: 'Katarzyna Wiśniewska', rating: 5, text: 'Idealne miejsce na romantyczną kolację. Atmosfera, jedzenie i obsługa – wszystko perfekcyjne.', text_en: 'The perfect place for a romantic dinner. Atmosphere, food and service – everything was perfect.' },
  ]
}

// Owner's 5 real gallery photos, embedded as base64 (see lib/gallery-images.js)
const OWNER_GALLERY = GALLERY_BASE64

export async function ensureSeed(db) {
  // ---- Content: ensure it exists AND always backfill any missing fields (self-healing) ----
  const existing = await db.collection('content').findOne({ id: 'site' })
  if (!existing) {
    await db.collection('content').insertOne({ ...DEFAULT_CONTENT })
  } else {
    const { _id, ...rest } = existing
    const merged = deepMergeDefaults(DEFAULT_CONTENT, rest)
    merged.id = 'site'
    // Only write when something is actually missing, to avoid pointless writes
    if (JSON.stringify(merged) !== JSON.stringify(rest)) {
      await db.collection('content').updateOne({ id: 'site' }, { $set: merged })
    }
  }

  // ---- Reviews: seed defaults when empty ----
  if ((await db.collection('reviews').countDocuments()) === 0) {
    await db.collection('reviews').insertMany(mkReviews())
  }

  await applyMigrations(db)

  // ---- Gallery: self-heal to the owner's real photos if it is empty ----
  // (Menu is intentionally left empty - the owner adds real dishes via the admin panel.)
  if ((await db.collection('gallery').countDocuments()) === 0) {
    await db.collection('gallery').insertMany(OWNER_GALLERY.map((url, i) => ({ id: uuidv4(), url, order: i })))
  }
}

// One-time data migrations - run automatically in every environment (incl. production after deploy)
async function applyMigrations(db) {
  const meta = await db.collection('meta').findOne({ id: 'meta' })
  if ((meta?.version || 1) < 2) {
    // v2: real restaurant data (address, phone, hours), new "about" photo, remove demo menu & gallery
    await db.collection('content').updateOne(
      { id: 'site' },
      {
        $set: {
          'contact.address': DEFAULT_CONTENT.contact.address,
          'contact.phone': DEFAULT_CONTENT.contact.phone,
          'contact.hours': DEFAULT_CONTENT.contact.hours,
          'contact.mapsEmbed': DEFAULT_CONTENT.contact.mapsEmbed,
          'contact.mapsLink': DEFAULT_CONTENT.contact.mapsLink,
          'about.image': DEFAULT_CONTENT.about.image,
        },
      }
    )
    await db.collection('menu').deleteMany({})
    await db.collection('gallery').deleteMany({})
    await db.collection('meta').updateOne({ id: 'meta' }, { $set: { id: 'meta', version: 2 } }, { upsert: true })
  }
  const meta2 = await db.collection('meta').findOne({ id: 'meta' })
  if ((meta2?.version || 1) < 3) {
    // v3: correct "about" photo (real restaurant interior uploaded by the owner)
    await db.collection('content').updateOne({ id: 'site' }, { $set: { 'about.image': DEFAULT_CONTENT.about.image } })
    await db.collection('meta').updateOne({ id: 'meta' }, { $set: { id: 'meta', version: 3 } }, { upsert: true })
  }
  const meta3 = await db.collection('meta').findOne({ id: 'meta' })
  if ((meta3?.version || 1) < 4) {
    // v4: real gallery photos uploaded by the owner (in the order they were sent)
    const photos = ['/gallery/g1.jpg', '/gallery/g2.jpg', '/gallery/g3.jpg', '/gallery/g4.jpg', '/gallery/g5.jpg']
    const count = await db.collection('gallery').countDocuments()
    await db.collection('gallery').insertMany(photos.map((url, i) => ({ id: uuidv4(), url, order: count + i })))
    await db.collection('meta').updateOne({ id: 'meta' }, { $set: { id: 'meta', version: 4 } }, { upsert: true })
  }
  const meta4 = await db.collection('meta').findOne({ id: 'meta' })
  if ((meta4?.version || 1) < 5) {
    // v5: backfill any missing content fields (e.g. `footer`, `social`, `about.features`)
    // for documents created with an older schema. Preserves the owner's real edits.
    const current = await db.collection('content').findOne({ id: 'site' })
    if (current) {
      const { _id, ...rest } = current
      const merged = deepMergeDefaults(DEFAULT_CONTENT, rest)
      merged.id = 'site'
      await db.collection('content').updateOne({ id: 'site' }, { $set: merged })
    }
    await db.collection('meta').updateOne({ id: 'meta' }, { $set: { id: 'meta', version: 5 } }, { upsert: true })
  }
  const meta5 = await db.collection('meta').findOne({ id: 'meta' })
  if ((meta5?.version || 1) < 6) {
    // v6: normalise legacy reviews that used `author` instead of `name`
    const legacy = await db.collection('reviews').find({ name: { $exists: false } }).toArray()
    for (const r of legacy) {
      await db.collection('reviews').updateOne(
        { id: r.id },
        { $set: { name: r.author || r.name || 'Klient' } }
      )
    }
    await db.collection('meta').updateOne({ id: 'meta' }, { $set: { id: 'meta', version: 6 } }, { upsert: true })
  }
  const meta6 = await db.collection('meta').findOne({ id: 'meta' })
  if ((meta6?.version || 1) < 7) {
    // v7: embed owner photos as base64 directly in the DB so they render in ANY
    // environment (incl. Railway) without relying on static /public file serving.
    // Replaces old file-path gallery entries (/gallery/*.jpg) and the about image.
    const fileBased = await db.collection('gallery').find({ url: { $regex: '^/gallery/' } }).toArray()
    if (fileBased.length > 0) {
      await db.collection('gallery').deleteMany({ url: { $regex: '^/gallery/' } })
      const count = await db.collection('gallery').countDocuments()
      await db.collection('gallery').insertMany(GALLERY_BASE64.map((url, i) => ({ id: uuidv4(), url, order: count + i })))
    }
    const con = await db.collection('content').findOne({ id: 'site' })
    if (con && (!con.about?.image || con.about.image === '/about.jpg' || con.about.image.startsWith('/about'))) {
      await db.collection('content').updateOne({ id: 'site' }, { $set: { 'about.image': ABOUT_BASE64 } })
    }
    await db.collection('meta').updateOne({ id: 'meta' }, { $set: { id: 'meta', version: 7 } }, { upsert: true })
  }
  const meta7 = await db.collection('meta').findOne({ id: 'meta' })
  if ((meta7?.version || 1) < 8) {
    // v8: set the owner's new main (hero) background photo, embedded as base64
    await db.collection('content').updateOne({ id: 'site' }, { $set: { 'hero.backgroundImage': HERO_BASE64 } })
    await db.collection('meta').updateOne({ id: 'meta' }, { $set: { id: 'meta', version: 8 } }, { upsert: true })
  }
}

// Deep-merges `defaults` into `actual`: keeps every value already present in
// `actual` (incl. empty strings the owner cleared on purpose) and only fills in
// keys that are missing. Arrays are kept as-is when present.
function deepMergeDefaults(defaults, actual) {
  if (Array.isArray(defaults)) {
    return Array.isArray(actual) ? actual : defaults
  }
  if (defaults && typeof defaults === 'object') {
    const out = actual && typeof actual === 'object' && !Array.isArray(actual) ? { ...actual } : {}
    for (const key of Object.keys(defaults)) {
      out[key] = deepMergeDefaults(defaults[key], out[key])
    }
    return out
  }
  return actual === undefined || actual === null ? defaults : actual
}
