import { v4 as uuidv4 } from 'uuid'

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
    subtitle: 'Miejsce stworzone z pasji do wyj\u0105tkowej kuchni oraz niezapomnianej atmosfery.',
    subtitle_en: 'A place created out of passion for exceptional cuisine and an unforgettable atmosphere.',
    backgroundImage: I[0],
  },
  about: {
    title: 'O restauracji',
    title_en: 'About the restaurant',
    text: 'Pan Kr\u00f3lik to restauracja, w kt\u00f3rej tradycja spotyka si\u0119 z nowoczesno\u015bci\u0105. Ka\u017cde danie tworzymy z pasj\u0105, dbaj\u0105c o najwy\u017csz\u0105 jako\u015b\u0107 sk\u0142adnik\u00f3w i wyj\u0105tkow\u0105 prezentacj\u0119.\n\nNasze wn\u0119trze \u0142\u0105czy elegancj\u0119 z ciep\u0142\u0105 atmosfer\u0105, dzi\u0119ki czemu ka\u017cda wizyta staje si\u0119 niezapomnianym prze\u017cyciem kulinarnym. Zapraszamy do \u015bwiata smak\u00f3w Pana Kr\u00f3lika.',
    text_en: 'Pan Kr\u00f3lik is a restaurant where tradition meets modernity. We craft every dish with passion, caring about the highest quality of ingredients and exceptional presentation.\n\nOur interior blends elegance with a warm atmosphere, making every visit an unforgettable culinary experience. Welcome to the world of flavours of Pan Kr\u00f3lik.',
    image: I[2],
    features: [
      { icon: 'Leaf', title: '\u015awie\u017ce sk\u0142adniki', title_en: 'Fresh ingredients' },
      { icon: 'MapPin', title: 'Lokalne produkty', title_en: 'Local products' },
      { icon: 'Sparkles', title: 'Wyj\u0105tkowa atmosfera', title_en: 'Unique atmosphere' },
      { icon: 'ConciergeBell', title: 'Profesjonalna obs\u0142uga', title_en: 'Professional service' },
    ],
  },
  contact: {
    address: 'ul. Przyk\u0142adowa 12, 00-001 Warszawa',
    phone: '+48 500 600 700',
    email: 'kontakt@pankrolik.pl',
    hours: [
      { day: 'Poniedzia\u0142ek \u2013 Czwartek', day_en: 'Monday \u2013 Thursday', time: '12:00 \u2013 22:00' },
      { day: 'Pi\u0105tek \u2013 Sobota', day_en: 'Friday \u2013 Saturday', time: '12:00 \u2013 24:00' },
      { day: 'Niedziela', day_en: 'Sunday', time: '12:00 \u2013 21:00' },
    ],
    mapsEmbed: 'https://www.google.com/maps?q=Warszawa%20Rynek&output=embed',
    mapsLink: 'https://www.google.com/maps/dir/?api=1&destination=Warszawa',
  },
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: '',
  },
  footer: {
    description: 'Restauracja Pan Kr\u00f3lik \u2013 dobry smak to sztuka. Zapraszamy na wyj\u0105tkow\u0105 podr\u00f3\u017c kulinarn\u0105 w eleganckiej i kameralnej atmosferze.',
    description_en: 'Pan Kr\u00f3lik Restaurant \u2013 good taste is an art. Join us for an exceptional culinary journey in an elegant and intimate atmosphere.',
  },
}

export function mkMenu() {
  const items = [
    // Przystawki
    { category: 'Przystawki', name: 'Carpaccio z pol\u0119dwicy', name_en: 'Beef Tenderloin Carpaccio', description: 'Cienko krojona pol\u0119dwica wo\u0142owa, rukola, p\u0142atki parmezanu, kapary i oliwa truflowa.', description_en: 'Thinly sliced beef tenderloin, rocket, parmesan shavings, capers and truffle oil.', price: '54 z\u0142', image: F[0] },
    { category: 'Przystawki', name: 'Tatar wo\u0142owy', name_en: 'Beef Tartare', description: 'Klasyczny tatar z pol\u0119dwicy, \u017c\u00f3\u0142tko, korniszony, cebula i grzybki marynowane.', description_en: 'Classic tenderloin tartare, egg yolk, gherkins, onion and marinated mushrooms.', price: '58 z\u0142', image: F[1] },
    { category: 'Przystawki', name: 'Krewetki w ma\u015ble czosnkowym', name_en: 'Garlic Butter Prawns', description: 'Krewetki tygrysie sma\u017cone na ma\u015ble z czosnkiem, chili i \u015bwie\u017c\u0105 pietruszk\u0105.', description_en: 'Tiger prawns pan-fried in butter with garlic, chilli and fresh parsley.', price: '62 z\u0142', image: F[3] },
    { category: 'Przystawki', name: 'Deska ser\u00f3w', name_en: 'Cheese Board', description: 'Wyb\u00f3r dojrzewaj\u0105cych ser\u00f3w, konfitura z figi, orzechy i mi\u00f3d.', description_en: 'A selection of matured cheeses, fig jam, nuts and honey.', price: '69 z\u0142', image: F[5] },
    // Zupy
    { category: 'Zupy', name: 'Krem z borowik\u00f3w', name_en: 'Porcini Cream Soup', description: 'Aksamitny krem z prawdziwych borowik\u00f3w z nut\u0105 trufli i grzankami.', description_en: 'Velvety porcini cream soup with a hint of truffle and croutons.', price: '32 z\u0142', image: F[6] },
    { category: 'Zupy', name: '\u017burek staropolski', name_en: 'Old-Polish Sour Rye Soup', description: 'Tradycyjny \u017curek na zakwasie, bia\u0142a kie\u0142basa i jajko, podawany w chlebie.', description_en: 'Traditional sourdough rye soup, white sausage and egg, served in bread.', price: '34 z\u0142', image: F[4] },
    { category: 'Zupy', name: 'Ros\u00f3\u0142 kr\u00f3lewski', name_en: 'Royal Broth', description: 'Bogaty ros\u00f3\u0142 z domowym makaronem i \u015bwie\u017cymi zio\u0142ami.', description_en: 'Rich broth with homemade noodles and fresh herbs.', price: '28 z\u0142', image: F[7] },
    // Dania g\u0142\u00f3wne
    { category: 'Dania g\u0142\u00f3wne', name: 'Pol\u0119dwica wo\u0142owa', name_en: 'Beef Tenderloin', description: 'Grillowana pol\u0119dwica z sosem demi-glace, pure ziemniaczane i warzywa sezonowe.', description_en: 'Grilled tenderloin with demi-glace sauce, potato pur\u00e9e and seasonal vegetables.', price: '98 z\u0142', image: F[2] },
    { category: 'Dania g\u0142\u00f3wne', name: 'Konfitowana kaczka', name_en: 'Duck Confit', description: 'Udko kaczki konfitowane, modra kapusta i sos \u017curawinowy.', description_en: 'Confit duck leg, red cabbage and cranberry sauce.', price: '84 z\u0142', image: F[7] },
    { category: 'Dania g\u0142\u00f3wne', name: '\u0141oso\u015b z grilla', name_en: 'Grilled Salmon', description: 'Filet z \u0142ososia, szpinak, sos cytrynowo-mas\u0142owy i szparagi.', description_en: 'Salmon fillet, spinach, lemon-butter sauce and asparagus.', price: '89 z\u0142', image: F[6] },
    { category: 'Dania g\u0142\u00f3wne', name: 'Comber z jagni\u0119ciny', name_en: 'Rack of Lamb', description: 'Delikatny comber jagni\u0119cy, sos rozmarynowy i ziemniaki fondant.', description_en: 'Tender rack of lamb, rosemary sauce and fondant potatoes.', price: '112 z\u0142', image: F[0] },
    { category: 'Dania g\u0142\u00f3wne', name: 'Pier\u015b z kaczki', name_en: 'Duck Breast', description: 'R\u00f3\u017cowa pier\u015b kaczki, pure z selera i sos wi\u015bniowy.', description_en: 'Pink duck breast, celeriac pur\u00e9e and cherry sauce.', price: '92 z\u0142', image: F[1] },
    { category: 'Dania g\u0142\u00f3wne', name: 'Risotto z trufl\u0105', name_en: 'Truffle Risotto', description: 'Kremowe risotto z parmezanem i \u015bwie\u017c\u0105 trufl\u0105.', description_en: 'Creamy risotto with parmesan and fresh truffle.', price: '76 z\u0142', image: F[10] },
    // Pizza
    { category: 'Pizza', name: 'Margherita', name_en: 'Margherita', description: 'Sos pomidorowy San Marzano, mozzarella, \u015bwie\u017ca bazylia.', description_en: 'San Marzano tomato sauce, mozzarella, fresh basil.', price: '39 z\u0142', image: F[2] },
    { category: 'Pizza', name: 'Prosciutto e Rucola', name_en: 'Prosciutto e Rucola', description: 'Mozzarella, prosciutto di Parma, rukola, parmezan.', description_en: 'Mozzarella, prosciutto di Parma, rocket, parmesan.', price: '49 z\u0142', image: F[3] },
    { category: 'Pizza', name: 'Quattro Formaggi', name_en: 'Quattro Formaggi', description: 'Cztery sery: mozzarella, gorgonzola, parmezan, provolone.', description_en: 'Four cheeses: mozzarella, gorgonzola, parmesan, provolone.', price: '47 z\u0142', image: F[5] },
    { category: 'Pizza', name: 'Diavola', name_en: 'Diavola', description: 'Pikantne salami, papryczki chili, mozzarella, sos pomidorowy.', description_en: 'Spicy salami, chilli peppers, mozzarella, tomato sauce.', price: '46 z\u0142', image: F[0] },
    // Burgery
    { category: 'Burgery', name: 'Classic Beef', name_en: 'Classic Beef', description: 'Wo\u0142owina 200g, cheddar, sa\u0142ata, pomidor, ogórek, sos w\u0142asny.', description_en: '200g beef, cheddar, lettuce, tomato, pickle, house sauce.', price: '48 z\u0142', image: F[12] },
    { category: 'Burgery', name: 'Pan Kr\u00f3lik Burger', name_en: 'Pan Kr\u00f3lik Burger', description: 'Podw\u00f3jna wo\u0142owina, boczek, karmelizowana cebula, ser i sos BBQ.', description_en: 'Double beef, bacon, caramelised onion, cheese and BBQ sauce.', price: '56 z\u0142', image: F[13] },
    { category: 'Burgery', name: 'Chicken Burger', name_en: 'Chicken Burger', description: 'Chrupi\u0105cy kurczak, sa\u0142ata, majonez chipotle, pikle.', description_en: 'Crispy chicken, lettuce, chipotle mayo, pickles.', price: '44 z\u0142', image: F[12] },
    // Makarony
    { category: 'Makarony', name: 'Tagliatelle z trufl\u0105', name_en: 'Truffle Tagliatelle', description: '\u015awie\u017cy makaron, sos \u015bmietanowy, trufla i parmezan.', description_en: 'Fresh pasta, cream sauce, truffle and parmesan.', price: '58 z\u0142', image: F[10] },
    { category: 'Makarony', name: 'Spaghetti Carbonara', name_en: 'Spaghetti Carbonara', description: 'Guanciale, \u017c\u00f3\u0142tko, pecorino, \u015bwie\u017co mielony pieprz.', description_en: 'Guanciale, egg yolk, pecorino, freshly ground pepper.', price: '46 z\u0142', image: F[11] },
    { category: 'Makarony', name: 'Pappardelle z ragout', name_en: 'Pappardelle with Ragout', description: 'Wolno duszone ragout wo\u0142owe z czerwonym winem.', description_en: 'Slow-braised beef ragout with red wine.', price: '54 z\u0142', image: F[10] },
    { category: 'Makarony', name: 'Penne Arrabiata', name_en: 'Penne Arrabiata', description: 'Pikantny sos pomidorowy z czosnkiem i chili.', description_en: 'Spicy tomato sauce with garlic and chilli.', price: '42 z\u0142', image: F[11] },
    // Desery
    { category: 'Desery', name: 'Tarta czekoladowa', name_en: 'Chocolate Tart', description: 'Kruche ciasto, ganache z gorzkiej czekolady, sól morska.', description_en: 'Shortcrust pastry, dark chocolate ganache, sea salt.', price: '29 z\u0142', image: F[8] },
    { category: 'Desery', name: 'Cr\u00e8me br\u00fbl\u00e9e', name_en: 'Cr\u00e8me br\u00fbl\u00e9e', description: 'Krem waniliowy z chrupi\u0105c\u0105 karmelow\u0105 skorupk\u0105.', description_en: 'Vanilla custard with a crisp caramel crust.', price: '27 z\u0142', image: F[9] },
    { category: 'Desery', name: 'Sernik po wiede\u0144sku', name_en: 'Viennese Cheesecake', description: 'Puszysty sernik na kruchym sp\u0119dzie z sosem malinowym.', description_en: 'Fluffy cheesecake on a shortcrust base with raspberry sauce.', price: '26 z\u0142', image: F[9] },
    // Napoje
    { category: 'Napoje', name: 'Lemoniada domowa', name_en: 'Homemade Lemonade', description: '\u015awie\u017co wyciskana cytryna, mi\u0119ta i syrop trzcinowy.', description_en: 'Freshly squeezed lemon, mint and cane syrup.', price: '18 z\u0142', image: F[9] },
    { category: 'Napoje', name: 'Wino czerwone (kieliszek)', name_en: 'Red Wine (glass)', description: 'Starannie wyselekcjonowane wino wytrawne.', description_en: 'A carefully selected dry wine.', price: '24 z\u0142', image: F[7] },
    { category: 'Napoje', name: 'Koktajl Pan Kr\u00f3lik', name_en: 'Pan Kr\u00f3lik Cocktail', description: 'Autorski koktajl na bazie gin, cytrusów i zi\u00f3\u0142.', description_en: 'Signature cocktail based on gin, citrus and herbs.', price: '32 z\u0142', image: F[8] },
  ]
  return items.map((it, idx) => ({ id: uuidv4(), order: idx, ...it }))
}

export function mkGallery() {
  const urls = [...I, F[0], F[1], F[2], F[3], F[6], F[8], F[10], F[12]]
  return urls.map((url, idx) => ({ id: uuidv4(), url, order: idx }))
}

export function mkReviews() {
  return [
    { id: uuidv4(), name: 'Anna Kowalska', rating: 5, text: 'Wyj\u0105tkowe miejsce! Ka\u017cde danie to prawdziwe dzie\u0142o sztuki. Obs\u0142uga na najwy\u017cszym poziomie.', text_en: 'An exceptional place! Every dish is a true work of art. Service at the highest level.' },
    { id: uuidv4(), name: 'Marek Nowak', rating: 5, text: 'Elegancki wystr\u00f3j i niesamowite smaki. Pol\u0119dwica wo\u0142owa rozp\u0142ywa\u0142a si\u0119 w ustach. Wr\u00f3cimy!', text_en: 'Elegant decor and amazing flavours. The beef tenderloin melted in the mouth. We will be back!' },
    { id: uuidv4(), name: 'Katarzyna Wi\u015bniewska', rating: 5, text: 'Idealne miejsce na romantyczn\u0105 kolacj\u0119. Atmosfera, jedzenie i obs\u0142uga \u2013 wszystko perfekcyjne.', text_en: 'The perfect place for a romantic dinner. Atmosphere, food and service \u2013 everything was perfect.' },
  ]
}

export async function ensureSeed(db) {
  const existing = await db.collection('content').findOne({ id: 'site' })
  if (!existing) await db.collection('content').insertOne({ ...DEFAULT_CONTENT })
  if ((await db.collection('menu').countDocuments()) === 0) await db.collection('menu').insertMany(mkMenu())
  if ((await db.collection('gallery').countDocuments()) === 0) await db.collection('gallery').insertMany(mkGallery())
  if ((await db.collection('reviews').countDocuments()) === 0) await db.collection('reviews').insertMany(mkReviews())
}
