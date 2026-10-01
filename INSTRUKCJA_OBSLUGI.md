# 📖 Instrukcja obsługi strony „Pan Królik"

Kompletny przewodnik po stronie internetowej i panelu administracyjnym (CMS).

---

## 1. Podstawowe adresy

| Co | Adres |
|---|---|
| Strona główna (dla gości) | `https://twoja-domena.pl/` |
| Panel administracyjny (CMS) | `https://twoja-domena.pl/admin` |

> Wystarczy dopisać `/admin` na końcu adresu strony, aby wejść do panelu.

---

## 2. Logowanie do panelu

1. Wejdź na adres strony i dopisz `/admin` (np. `twoja-domena.pl/admin`).
2. Pojawi się ekran logowania z jednym polem: **Hasło**.
3. Wpisz hasło administratora: **`pankrolik2025`**
4. Kliknij **Zaloguj**.

✅ Po zalogowaniu przeglądarka **zapamiętuje sesję** – przy kolejnych wejściach na `/admin` z tego samego komputera/telefonu nie trzeba logować się ponownie.

### Wylogowanie
W prawym górnym rogu panelu kliknij przycisk **Wyloguj**. Po wylogowaniu ponowne wejście do panelu wymaga wpisania hasła.

---

## 3. Dostęp dla innych osób („konta")

Panel działa na zasadzie **jednego wspólnego hasła** – nie ma osobnych kont z loginami. To celowo proste rozwiązanie dla małego zespołu restauracji.

### Jak dać komuś dostęp do panelu?
1. Przekaż tej osobie **adres panelu**: `twoja-domena.pl/admin`
2. Przekaż jej **hasło**: `pankrolik2025`
3. Ta osoba loguje się dokładnie tak samo jak Ty – i ma pełne uprawnienia do edycji.

### Jak odebrać komuś dostęp?
Wystarczy **zmienić hasło** (patrz punkt 4). Stare hasło przestaje działać u wszystkich, a nowe przekazujesz tylko zaufanym osobom.

> 💡 **Wskazówka:** Hasło przekazuj bezpiecznym kanałem (np. osobiście lub telefonicznie), nie publikuj go nigdzie na stronie ani w mediach społecznościowych.

---

## 4. Zmiana hasła administratora

Hasło jest ustawione w konfiguracji serwera (zmienna środowiskowa `ADMIN_PASSWORD`).

**Jak zmienić:**
1. W pliku konfiguracyjnym `.env` (w głównym katalogu aplikacji) dodaj lub zmień linię:
   ```
   ADMIN_PASSWORD=TwojeNoweHaslo123
   ```
2. Zrestartuj aplikację (na hostingu Emergent: przycisk restart / redeploy).
3. Od tej chwili logowanie działa **tylko** z nowym hasłem.

⚠️ Po zmianie hasła wszystkie zalogowane wcześniej osoby zostaną automatycznie wylogowane i będą musiały wpisać nowe hasło.

> Jeśli nie czujesz się pewnie w zmianie plików konfiguracyjnych – poproś osobę techniczną lub napisz do wykonawcy strony. To operacja na 1 minutę.

---

## 5. Panel administracyjny – co gdzie jest

Po zalogowaniu widzisz **4 zakładki**:

### 🛠️ Zakładka „Treść strony"
Edycja wszystkich tekstów i ustawień strony głównej:

- **Sekcja Hero (góra strony):** nagłówek, opis (PL i EN) oraz zdjęcie tła.
- **Sekcja „O nas":** tytuł, opis (2 akapity – oddziel je pustą linią), zdjęcie oraz **4 kafelki z atutami** (każdy w wersji PL i EN).
- **Kontakt:** adres restauracji, telefon, e-mail, link do nawigacji Google Maps oraz **link „embed" mapy Google** (patrz punkt 8).
- **Godziny otwarcia:** dzień (PL/EN) + godziny dla każdego wiersza.
- **Social media:** linki do Instagrama, Facebooka i TikToka (opcjonalnie).
- **Stopka:** opis w wersji PL i EN.

Po wprowadzeniu zmian kliknij przycisk **Zapisz** – pojawi się potwierdzenie.

### 🍽️ Zakładka „Menu"
Zarządzanie kartą dań. Menu ma 8 stałych kategorii:
**Przystawki, Zupy, Dania główne, Pizza, Burgery, Makarony, Desery, Napoje.**

- **Dodanie pozycji:** kliknij „Dodaj pozycję" → powstanie nowa pozycja, którą edytujesz (nazwa PL/EN, opis PL/EN, cena, kategoria, opcjonalnie zdjęcie).
- **Edycja:** zmień pola i kliknij **Zapisz** przy danej pozycji.
- **Usunięcie:** kliknij ikonę kosza przy pozycji.
- **Cena:** wpisujesz jako tekst, np. `39 zł` – możesz dowolnie formatować.

### 🖼️ Zakładka „Galeria"
Zarządzanie zdjęciami w galerii na stronie:

- **Dodanie zdjęcia:** wklej adres URL zdjęcia **lub** kliknij „prześlij plik z dysku" i wybierz zdjęcie z komputera/telefonu.
- **Usunięcie:** ikona kosza przy zdjęciu.

> 💡 Zalecenia dot. zdjęć: format poziomy lub pionowy JPG/PNG, rozsądny rozmiar (najlepiej do ~1–2 MB), dobre oświetlenie. Zdjęcia wgrane z dysku zapisują się bezpośrednio w bazie danych strony.

### ⭐ Zakładka „Opinie"
Zarządzanie opiniami klientów wyświetlanymi na stronie:

- **Dodanie:** „Dodaj opinię" → wpisz imię klienta, ocenę (1–5 gwiazdek) i treść (PL i EN).
- **Edycja / usunięcie:** analogicznie jak w menu – przycisk Zapisz lub ikona kosza.

---

## 6. Dwujęzyczność (PL / EN)

- Strona ma przełącznik języka **PL/EN** w menu nawigacji.
- W panelu prawie każde pole tekstowe ma dwie wersje: **(PL)** i **(EN)**.
- **Pola EN można zostawić puste** – wtedy strona w wersji angielskiej pokaże tekst polski (nic się nie zepsuje).
- Ceny, telefony, adresy i linki są wspólne dla obu języków.

---

## 7. Zdjęcia – jak je dodawać

Masz dwie możliwości (dotyczy tła Hero, zdjęcia „O nas", zdjęć dań i galerii):

1. **Adres URL** – wklejasz link do zdjęcia z internetu (np. z Unsplash lub własnego serwera).
2. **Plik z dysku** – klikasz „prześlij plik z dysku" i wybierasz zdjęcie; zostanie zapisane w bazie strony.

Po dodaniu zobaczysz miniaturkę podglądu. Pamiętaj o kliknięciu **Zapisz**.

---

## 8. Mapa Google – jak podmienić adres

Gdy będziesz mieć docelowy adres restauracji:

1. Wejdź na [Google Maps](https://maps.google.com) i wyszukaj adres restauracji.
2. Kliknij **Udostępnij** → zakładka **Umieszczanie mapy**.
3. Skopiuj **sam link z atrybutu `src="..."`** (zaczyna się od `https://www.google.com/maps/embed?...`).
4. Wklej go w panelu: **Treść strony → Kontakt → Mapa Google (link embed)**.
5. Dodatkowo w polu **Link nawigacji Google Maps** wklej zwykły link do miejsca (przycisk „Udostępnij" → „Kopiuj link") – działa jako „Wyznacz trasę".
6. Kliknij **Zapisz**.

---

## 9. Najczęstsze pytania (FAQ)

**Zmieniłem coś w panelu, ale nie widzę zmian na stronie.**
Odśwież stronę główną (F5 lub pociągnij w dół na telefonie). Upewnij się też, że kliknąłeś **Zapisz** w panelu.

**Zapomniałem hasła.**
Hasło można odczytać/zmienić w konfiguracji serwera (zmienna `ADMIN_PASSWORD`, domyślnie `pankrolik2025`). Patrz punkt 4.

**Czy mogę edytować panel z telefonu?**
Tak – panel jest responsywny i działa na telefonie oraz tablecie.

**Czy klienci widzą panel?**
Nie. Panel jest dostępny tylko pod adresem `/admin` i wymaga hasła. Na stronie głównej nie ma do niego żadnego linku.

**Ile osób może korzystać z panelu jednocześnie?**
Dowolna liczba – każdy, kto zna hasło. Uwaga: jeśli dwie osoby edytują to samo pole jednocześnie, zapisze się wersja osoby, która kliknęła „Zapisz" jako ostatnia.

**Czy mogę zepsuć stronę przez panel?**
Nie – panel pozwala tylko na zmianę treści, zdjęć i pozycji menu. Wygląd i układ strony pozostają nienaruszone. W najgorszym razie usuniesz jakiś tekst, który zawsze możesz wpisać ponownie.

---

## 10. Dane dostępowe (ściąga)

| Element | Wartość |
|---|---|
| Panel administracyjny | `adres-strony/admin` |
| Hasło | `pankrolik2025` |
| Zmiana hasła | zmienna `ADMIN_PASSWORD` w pliku `.env` + restart aplikacji |

> 🔒 **Po przekazaniu strony właścicielowi zalecana jest zmiana hasła na własne.**
