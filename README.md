# Moment 2, _Introduktion till webbtjänster_
Den här README-filen har skapats för att beskriva momentets syfte och beskriva hur arbetsprocessen sett ut och 
hur resultatet av den blev. Den är även skapad för att beskriva installation och användning av resultatet; webbtjänsten.

## Momentets syfte

- Bekanta mig med begreppet webbtjänster och förstå hur man kan använda dessa för att skapa moderna och plattformsoberoende applikationer.
- Kunna skapa en REST-baserad webbtjänst som använder en relationsbaserad databasserver för lagring.
- Kunna använda Fetch API för att konsumera en webbtjänst.

## Arbetsprocess

Jag förberedde först utvecklingsmiljön med NPM och Express. Sedan skapade jag olika routes som implementerade **CRUD**; create (POST), read (GET), update (PUT) och delete (DELETE). Jag testade dessa routes i ThunderClient med "message" för att kontrollera att de gav ett korrekt response och under denna process inkluderade jag middleware för Cors och Express för att hantera säkerhetsaspekter för en "cross origin request" respektive hantera JSON-format.

Jag utvecklade sedan read-metoden för att kunna läsa in data med GET. Här inkluderades kontroller och felmeddelande vid error/tom tabell. Därfter utvecklade jag create-metoden för att kunna skapa och lagra data. Här inkluderades kontroller och felmeddelande vid error/input-fel samt en SQL-fråga för POST med tillhörande kontroller och felmeddelanden. Med ThunderClient la jag sedan in data i databasen vilka jag kunde se i admin-verktyget pgAdmin. Genom ett AJAX-anrop med FetchAPI kunde jag sen i webbläsaren se datan som en array med objekt i konsollen.

Jag utvecklade sedan read-metoden för att kunna läsa in specifik data med GET och endpointen /work/:id. Här inkluderades en SQL-fråga för kontroll av existerande id och felmeddelanden för detta. Därefter utvecklade jag update-metoden för att läsa in existerande data med PUT och tillhörande kontroller av id och felmeddelande vid icke-existens. Här inkluderades även en SQL-fråga för att uppdatera existerande specifika poster med ny information och en output med uppdaterad post. Slutligen utvecklades delete-metoden för inläsning av existerande data med tillhörande kontroller och en SQL-fråga för radering av specifika poster och en output med raderad post.

## Installation och anslutning till databas

Webbtjänsten använder en PostgreSQL-databas. Installation-scriptet är install.js och här finns inställningar för anslutningen till databasen och det skapar även tabellen moment2_work som innehåller fält enligt nedan:

| **Tabellnamn**   | **Fält**                                                                                 |
|--------------|--------------------------------------------------------------------------------------|
| moment2_work | workid(**PK** integer), companyname(text), jobtitle(text), location(text), description(text) |

## Användning av API

Här nedan beskrivs användningen av API:et:

| **Metod** | **Endpoint** | **Beskrivning**                                                                                                                                   |
|:---------:|:------------:|---------------------------------------------------------------------------------------------------------------------------------------------------|
| GET       | /work        | Hämtar alla lagrade jobb.                                                                                                                         |
| GET       | /work/:id    | Hämtar ett specifikt jobb med angivet ID.                                                                                                         |
| POST      | /work        | Lagrar ett nytt jobb. Kräver att ett objekt med fyra fält; companyname, jobtitle, location och description skickas med.                           |
| PUT       | /work/:id    | Uppdaterar ett existerande jobb med angivet ID. Kräver att ett objekt med fyra fält; companyname, jobtitle, location och description skickas med. |
| DELETE    | /work/:id    | Raderar ett jobb med angivet ID.                                                                                                                  |

### Output

Ett jobb-objekt returneras/skickas i JSON-format med följande struktur:
```
{
   "workid": 1,
   "companyname": "Solens förskola",
   "jobtitle": "Förskollärare",
   "location": "Malmö",
   "description": "Ansvar för det pedagogiska innehållet i undervisningen och att leda undervisningen 
   på ett sådant sätt att målen och intentionerna i läroplanen uppfylls."
}
```

#### _Skapad av Jenny Lind, jeli2308_.