const mongoose = require("mongoose"),
    Post = require("./models/post");
const fs = require("fs");
const path = require("path");
    User = require("./models/user");
mongoose.connect(
    "mongodb://127.0.0.1:27017/creape_db",
    { useNewUrlParser: true }
);

mongoose.connection;

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage });

const posts = [
    {
        title: "Schnecke mit Plüschhaus",
        description: "Erstelle einfach eine süße Schnecke mit Haushaltsmaterialien. Ein schöner Dekogegenstand oder eine tolle Bastelaktion für Kinder.",
        img: "https://1.bp.blogspot.com/_S842QDROCoo/S8sWEjWV1GI/AAAAAAAAAHo/TDGKgBLmHbs/s1600/schnecke.JPG",
        steps: [
            {
                number: 1,
                description: "Zuerst schneide aus dem Filzstoff den Körper der Schnecke aus. Zeichne dazu eine Spirale auf den Stoff und schneide entlang der Linie. Der Körper kann in beliebiger Größe sein, abhängig von deinen Vorlieben."
            },
            {
                number: 2,
                description: "Schneide aus dem Plüschstoff ein Rechteck aus, das als Haus für die Schnecke dienen soll. Die Größe des Rechtecks sollte groß genug sein, um den Körper der Schnecke darin zu verstauen. Du kannst das Haus nach Belieben verzieren, zum Beispiel mit Fenstern oder einer Tür."
            },
            {
                number: 3,
                description: "Wenn du möchtest, kannst du den Körper der Schnecke mit Stiften oder Stoffmalfarben bemalen, um ihm ein bunteres Aussehen zu verleihen. Lass die Farbe gut trocknen, bevor du fortfährst."
            },
            {
                number: 4,
                description: "Falte den Filzstreifen entlang der Spirale, so dass die Schnecke eine 3D-Form erhält. Verwende Klebstoff oder Nadel und Faden, um die Enden des Filzstreifens zu fixieren."
            },
            {
                number: 5,
                description: "Fülle den Körper der Schnecke mit dem Füllmaterial, bis er schön rund und weich ist. Achte darauf, dass du genug Füllung verwendest, damit die Schnecke stabil steht und sich nicht zusammenfaltet."
            },
            {
                number: 6,
                description: "Befestige den Schneckenkörper mit Klebstoff oder Nadel und Faden am Boden des Plüschhauses. Platziere ihn so, dass er komplett im Haus verschwindet."
            },
            {
                number: 7,
                description: "Wenn du möchtest, kannst du jetzt noch Augen auf die Schnecke kleben oder aus Filz ausschneiden und aufnähen. Verziere das Haus nach Belieben mit zusätzlichen Details aus Filzstoff."
            },
            {
                number: 8,
                description: "Lasse den Klebstoff gut trocknen, wenn du ihn verwendet hast, bevor du die Schnecke herumträgst oder damit spielst."
            },
            {
                number: 9,
                description: "Jetzt hast du eine niedliche Schnecke mit einem gemütlichen Plüschhaus gebastelt! Du kannst weitere Schnecken in verschiedenen Farben und Größen herstellen und eine ganze Schneckenfamilie erschaffen. Viel Spaß beim Basteln!"
            },
        ],
    },
    {
        title: "Papierkürbis",
        description: "Ein lustiger und simpler Papierkürbis. Perfekt für die Halloweenzeit als Zimmer-, Balkon- oder Verandadekoration. Das DIY ist schnell gemacht und perfekt für gruselige Partys mit Kindern.",
        img: "https://i.pinimg.com/originals/45/5c/87/455c876b82f2ce786fa311deb630664a.jpg",
        steps: [
            {
                number: 1,
                description: "Schneide ein quadratisches Stück Papier aus, das als Basis für den Kürbis dienen soll. Die Größe hängt davon ab, wie groß du den Kürbis machen möchtest. Ein 20x20cm großes Papier eignet sich gut für einen kleinen Kürbis."
            },
            {
                number: 2,
                description: "Falte das Papier diagonal, so dass eine Ecke auf die gegenüberliegende Ecke trifft. Drücke die Falz gut mit dem Finger oder einem Lineal fest."
            },
            {
                number: 3,
                description: "Wiederhole den Schritt 2 mit den beiden anderen Ecken, so dass das Papier nun eine Falz hat, die wie ein X über das Quadrat verläuft."
            },
            {
                number: 4,
                description: "Falte die Ecken des Papiers entlang der Faltlinien nach innen, so dass eine dreidimensionale Form entsteht."
            },
            {
                number: 5,
                description: "Klebe oder klebebande die Kanten der Ecken aneinander, so dass der Kürbis zusammengehalten wird."
            },
            {
                number: 6,
                description: "Schneide aus dem grünen oder braunen Papier einen Streifen aus, der als Stiel des Kürbis dienen soll. Die Größe hängt davon ab, wie groß der Kürbis ist. Ein 2-3cm breiter und 10-15cm langer Streifen funktioniert gut für einen kleinen Kürbis."
            },
            {number: 7, description: "Rolle den Streifen zu einer Zylinderform auf und klebe ihn zusammen."},
            {number: 8, description: "Klebe den Stiel an die Oberseite des Kürbis."},
            {
                number: 9,
                description: "Wenn du möchtest, kannst du aus grünem Papier noch ein paar Blätter ausschneiden und sie auf den Stiel kleben."
            },
            {
                number: 10,
                description: "Jetzt hast du einen einfachen Papierkürbis gebastelt! Du kannst mehrere Kürbisse in verschiedenen Größen und Farben herstellen und sie als Dekoration aufstellen oder als Geschenk verpacken. Viel Spaß beim Basteln!"
            },
        ]

    },
    {
        title: "Simple Holzgartenbank",
        description: "Ein DIY für etwas fortgeschrittenere Bastler. Eine Holzbank aus Holzresten. Es werden Werkzeug und Holzschrauben benötigt. Eher nicht für Kinder geeignet!",
        img: "https://tse4.mm.bing.net/th?id=OIP.5-u1zAdSG7-sN7rG6Kuz4wHaFS&pid=Api",
        steps: [
            {
                number: 1,
                description: "Beginne damit, die beiden langen Holzbretter als Sitzfläche der Bank zu verwenden. Lege sie parallel zueinander auf den Boden, mit einer Lücke von etwa 2 cm zwischen ihnen."
            },
            {
                number: 2,
                description: "Nimm nun ein kurzes Holzbrett und positioniere es senkrecht an einem Ende der Sitzfläche. Achte darauf, dass es bündig mit der Oberkante der Sitzfläche abschließt."
            },
            {
                number: 3,
                description: "Verwende den Schraubenzieher oder Akkuschrauber, um das kurze Holzbrett mit den langen Brettern zu verschrauben. Platziere die Schrauben etwa alle 15 cm entlang des Bretts. Wiederhole diesen Schritt am anderen Ende der Sitzfläche mit dem zweiten kurzen Holzbrett."
            },
            {
                number: 4,
                description: "Die beiden verbleibenden Holzbretter werden als Beine der Bank dienen. Positioniere sie senkrecht an den äußeren Enden der kurzen Holzbretter. Achte darauf, dass sie bündig mit der Vorderkante der Sitzfläche abschließen."
            },
            {
                number: 5,
                description: "Verschraube die Beine mit den kurzen Holzbrettern, indem du Schrauben von der Oberseite der Sitzfläche in die Beine einbringst. Platziere die Schrauben in regelmäßigen Abständen entlang der Verbindungslinie zwischen den Beinen und den kurzen Holzbrettern."
            },
            {
                number: 6,
                description: "Überprüfe die Stabilität der Bank, indem du auf ihr sitzt oder leicht wackelst. Falls nötig, ziehe die Schrauben fest, um sicherzustellen, dass alle Teile gut verbunden sind."
            },
            {
                number: 7,
                description: "Um die Oberfläche der Bank glatt zu machen, verwende Schleifpapier, um alle scharfen Kanten oder Unebenheiten abzuschleifen. Du kannst auch die gesamte Bank leicht abschleifen, um eine gleichmäßige Oberfläche zu erhalten."
            },
            {
                number: 8,
                description: "Optional kannst du die Bank mit Lack oder Holzlasur behandeln, um sie vor Witterungseinflüssen zu schützen und ihr eine attraktivere Optik zu verleihen. Lasse die Farbe gut trocknen, bevor du die Bank benutzt."
            },
            {
                number: 9,
                description: "Jetzt hast du eine einfache Holzbank gebaut! Du kannst sie im Garten, auf der Terrasse oder auch im Innenbereich verwenden. Achte darauf, dass die Bank auf einer ebenen Fläche steht und stabil ist, bevor du dich darauf setzt. Viel Spaß beim Genießen deiner selbstgebauten Bank!"
            },
        ]
    },
    {
        title: "Glühbirnen-Hochzeitsdeko",
        description: "Was soll man nur tun mit den alten Glühbirnen aus dem letzten Jahrzehnt? Wie wär's mit diesen freihängenden Glühbirnen als Pflanzen oder Blumen Vitrinen. Eine schöne Dekoration für Hochzeiten oder fürs Zimmer.",
        img: "https://www.familyhandyman.com/wp-content/uploads/2018/04/shutterstock_354527417.jpg",
        steps: [
            {
                number: 1,
                description: "Beginne damit, die Glühbirnen vorzubereiten, indem du die Metallkappe und den Glühfaden entfernst. Achte dabei darauf, vorsichtig zu arbeiten, um Verletzungen zu vermeiden. Verwende dazu eine Zange oder einen Schraubendreher, um die Kappe abzuschrauben und den Glühfaden zu entfernen."
            },
            {
                number: 2,
                description: "Wenn du möchtest, kannst du die Glühbirnen nach Belieben dekorieren. Du kannst sie mit Farben bemalen oder Glitzer darauf auftragen, um ihnen einen besonderen Look zu verleihen. Lasse die Farbe oder den Glitzer gut trocknen, bevor du mit dem nächsten Schritt fortfährst."
            },
            {
                number: 3,
                description: "Schneide ein Stück Schnur oder Juteband ab, das lang genug ist, um die Glühbirne daran aufzuhängen. Die Länge hängt davon ab, wie hoch du die Glühbirnen hängen möchtest."
            },
            {
                number: 4,
                description: "Binde die Schnur oder das Juteband um den Metallsockel der Glühbirne. Stelle sicher, dass es sicher befestigt ist, damit die Glühbirne nicht herunterfällt."
            },
            {number: 5, description: "Fülle die Glühbirnen etwa zur Hälfte mit Wasser."},
            {
                number: 6,
                description: "Passe die Länge der Schnur oder des Jutebands an, indem du es an einem geeigneten Ort aufhängst und die Glühbirne daran befestigst. Du kannst sie an einem Ast im Freien oder an einem Haken in deinem Zuhause aufhängen."
            },
            {
                number: 7,
                description: "Schneide die Stiele deiner ausgewählten Blumen oder Pflanzen auf die gewünschte Länge und stecke sie in die Glühbirnen. Achte darauf, dass sie gut im Wasser stehen und ausreichend Halt haben."
            },
            {
                number: 8,
                description: "Hänge die dekorierten Glühbirnen an den gewünschten Ort auf und bewundere deine hängenden Glühbirnen als Blumenvasen Deko!"
            },
            {
                number: 9,
                description: "Du kannst verschiedene Glühbirnen in verschiedenen Größen und Farben verwenden, um einen interessanten Effekt zu erzielen. Experimentiere auch mit verschiedenen Blumen und Pflanzen, um deiner Deko eine persönliche Note zu verleihen. Viel Spaß beim Basteln und Dekorieren!"
            },
        ]
    },
    {
        title: "Palettenregal",
        description: "Kreiere ein stylisches Palettenregal für dein Zuhause. Perfekt, um Kleinzeug oder Dekoartikel aufzubewahren oder zu präsentieren.",
        img: "http://pallet.selbermachendeko.com/wp-content/uploads/2019/05/33-Clever-DIY-Box-Hanging-Standing-Planter-Ideas.jpg",
        steps: [
            {
                number: 1,
                description: "Beginne damit, die Holzpaletten vorzubereiten. Untersuche sie auf Beschädigungen oder lose Bretter. Wenn nötig, repariere sie oder ersetze defekte Teile. Entferne auch eventuell vorhandene Nägel oder Klammern, um eine sichere und stabile Konstruktion zu gewährleisten."
            },
            {
                number: 2,
                description: "Schleife die Oberflächen der Paletten gründlich ab, um raue Stellen oder Splitter zu entfernen. Achte besonders auf die Kanten und Ecken, um Verletzungen zu vermeiden. Wenn du möchtest, kannst du die Paletten anschließend mit Farbe oder Holzlasur nach deiner Wahl gestalten. Lasse die Farbe gut trocknen, bevor du mit dem nächsten Schritt fortfährst."
            },
            {
                number: 3,
                description: "Bestimme den Standort für dein Palettenregal und markiere die Positionen, an denen du die Paletten befestigen möchtest. Verwende eine Wasserwaage, um sicherzustellen, dass die Markierungen gerade und auf gleicher Höhe sind."
            },
            {
                number: 4,
                description: "Jetzt kannst du die Paletten an der Wand befestigen. Platziere die erste Palette an der markierten Stelle und überprüfe mit der Wasserwaage, ob sie gerade ist. Halte sie fest an der Wand und schraube sie mit Schrauben durch die verstärkten Bereiche der Palette in die Wand. Wiederhole diesen Schritt für jede weitere Palette, die du hinzufügen möchtest."
            },
            {
                number: 5,
                description: "Stelle sicher, dass jede Palette sicher und stabil an der Wand befestigt ist, indem du die Schrauben gut festziehst. Überprüfe erneut mit der Wasserwaage, ob die Paletten gerade sind."
            },
            {
                number: 6,
                description: "Du kannst nun deine Regale nach Belieben gestalten. Du kannst sie als offene Regale verwenden oder zusätzliche Bretter auf den Palettenböden befestigen, um Ablageflächen zu schaffen. Verwende dazu Schrauben, um die zusätzlichen Bretter sicher an den vorhandenen Palettenbrettern zu befestigen."
            },
            {
                number: 7,
                description: "Räume dein Palettenregal ein und genieße deine selbstgemachte und individuelle Aufbewahrungslösung!"
            },
            {
                number: 8,
                description: "Beachte, dass die Stabilität des Regals von der Qualität der verwendeten Paletten und der Befestigung an der Wand abhängt. Achte darauf, dass die Paletten sicher und fest an der Wand befestigt sind, um Unfälle zu vermeiden. Viel Spaß beim Basteln und Organisieren!"
            },
        ]
    },
    {
        title: "Katzenhaus aus Obstkisten",
        description: "Baue deinen samtpfötigen Mitbewohnern eine gemütliche Unterkunft und einen Rückzugsort in deinem Zuhause. Alternativ kannst du es auch als Bücherregal nutzen.",
        img: "https://i.pinimg.com/originals/69/f4/7f/69f47f1c1956c6e147dd83f84806ad0f.jpg",
        steps: [
            {
                number: 1,
                description: "Beginne damit, die Obstkisten vorzubereiten. Untersuche sie auf Beschädigungen oder lose Bretter. Wenn nötig, repariere sie oder ersetze defekte Teile. Schleife die Oberflächen der Kisten gründlich ab, um raue Stellen oder Splitter zu entfernen. Wenn du möchtest, kannst du die Kisten anschließend mit Farbe oder Holzlasur nach deiner Wahl gestalten. Lasse die Farbe gut trocknen, bevor du mit dem nächsten Schritt fortfährst."
            },
            {
                number: 2,
                description: "Platziere die erste Obstkiste auf dem Boden oder einem festen Untergrund, sodass die offene Seite nach vorne zeigt. Dies wird die untere Ebene des Katzenhausregals sein."
            },
            {
                number: 3,
                description: "Stelle die zweite Obstkiste auf die offene Seite und schiebe sie so nah wie möglich an die erste Kiste heran. Dies wird die mittlere Ebene des Regals sein."
            },
            {
                number: 4,
                description: "Platziere die dritte Obstkiste auf die offene Seite und schiebe sie ebenfalls so nah wie möglich an die vorherige Kiste heran. Dies wird die oberste Ebene des Regals sein."
            },
            {
                number: 5,
                description: "Um die Kisten miteinander zu verbinden, verwende Schrauben, um sie sicher zu fixieren. Bohre vorgebohrte Löcher in die Kisten und befestige sie dann mit Schrauben. Achte darauf, dass die Schrauben die Kisten gut miteinander verbinden, um die Stabilität des Regals zu gewährleisten."
            },
            {
                number: 6,
                description: "Wenn du möchtest, kannst du die Kisten mit Kissen oder Decken ausstatten, um sie bequemer für deine Katze zu machen. Lege ein weiches Kissen oder eine weiche Decke in jede Ebene des Regals, sodass deine Katze einen gemütlichen Platz zum Ausruhen hat."
            },
            {
                number: 7,
                description: "Platziere das Katzenhausregal an einem geeigneten Ort in deinem Zuhause, an dem deine Katze gerne spielt und entspannt."
            },
            {
                number: 8,
                description: "Jetzt hast du ein einfaches und kostengünstiges Katzenhausregal aus Obstkisten gebaut! Deine Katze wird es lieben, darin zu klettern, sich auszuruhen und zu spielen. Achte darauf, dass das Regal stabil steht und keine scharfen Kanten oder lose Teile hat, um die Sicherheit deiner Katze zu gewährleisten. Viel Spaß beim Basteln und Beobachten, wie deine Katze das neue Haus erkundet!"
            },
        ]
    },
    {
        title: "Armbänder Knüpfen für Kinder",
        description: "Eine einfache Anleitung für Freundschaftsarmbänder, perfekt um Knüpfen zu erlernen und einfach mal den besten Freunden ein Geschenk zu machen.",
        img: "https://i.pinimg.com/originals/43/39/42/433942496868fc18e86b3c44260d5c13.jpg",
        steps: [
            {
                number: 1,
                description: "Wähle die Farben für dein Freundschaftsarmband aus. Du kannst eine Farbe oder mehrere Farben kombinieren, je nachdem, wie du das Armband gestalten möchtest."
            },
            {
                number: 2,
                description: "Schneide die Fäden in einer Länge von ca. 1 Meter ab. Du kannst die Länge anpassen, je nachdem wie groß du das Armband haben möchtest."
            },
            {
                number: 3,
                description: "Nimm die Fäden zusammen und lege sie in der Mitte zusammen. Binde einen Knoten an der oberen Enden der Fäden, sodass sie zusammengehalten werden."
            },
            {
                number: 4,
                description: "Befestige die Fäden an einer festen Unterlage, beispielsweise mit einem Klebeband, um das Knüpfen zu erleichtern."
            },
            {
                number: 5,
                description: "Teile die Fäden in zwei Gruppen auf, wobei jede Gruppe aus der Hälfte der Fäden besteht."
            },
            {
                number: 6,
                description: "Beginne mit dem Knüpfen des Armbands. Nimm den äußersten linken Faden der linken Gruppe und führe ihn über die Fäden der rechten Gruppe hinweg. Führe ihn dann unter dem äußersten rechten Faden der rechten Gruppe hindurch und ziehe ihn fest."
            },
            {
                number: 7,
                description: "Nimm nun den äußersten rechten Faden der rechten Gruppe und führe ihn über die Fäden der linken Gruppe hinweg. Führe ihn dann unter dem äußersten linken Faden der linken Gruppe hindurch und ziehe ihn fest."
            },
            {
                number: 8,
                description: "Wiederhole Schritt 6 und 7, um das Armband weiter zu knüpfen. Die Fäden werden sich beim Knüpfen umwickeln und das Muster des Armbands bilden."
            },
            {
                number: 9,
                description: "Knüpfe weiter, bis das Armband die gewünschte Länge erreicht hat. Du kannst zwischendurch die Farben wechseln oder Muster einfügen, um das Armband interessanter zu gestalten."
            },
            {
                number: 10,
                description: "Wenn du das Armband fertig geknüpft hast, mache einen Knoten am unteren Ende, um die Fäden zusammenzuhalten."
            },
            {
                number: 11,
                description: "Schneide die überschüssigen Fäden ab, sodass das Armband gleichmäßig abschließt."
            },
            {
                number: 12,
                description: "Jetzt hast du ein selbstgemachtes Freundschaftsarmband! Wiederhole den Vorgang, um weitere Armbänder zu knüpfen und sie mit deinen Freunden auszutauschen. Es ist eine schöne Möglichkeit, eure Freundschaft zu feiern und ein individuelles Accessoire zu tragen. Viel Spaß beim Knüpfen!"
            },
        ]
    },
    {
        title: "Origami-Kranich",
        description: "Bastel eine der berühmtesten Origamifiguren mit Hilfe dieser simplen Anleitung!",
        img: "https://2.bp.blogspot.com/-J2IiuyCG68I/VpKXaoeyFiI/AAAAAAAAMHA/J-G6--_EUFM/s1600/IMG_4999.jpg",
        steps: [
            {number: 1, description: "Lege das quadratische Papier vor dich hin, mit einer Ecke nach oben zeigend."},
            {
                number: 2,
                description: "Falte das Papier diagonal, sodass eine Ecke auf die gegenüberliegende Ecke trifft. Drücke die Falte fest, um sie zu fixieren."
            },
            {
                number: 3,
                description: "Öffne das Papier und falte es diagonal in die andere Richtung, sodass sich die gegenüberliegenden Ecken treffen. Drücke die Falte fest, um sie zu fixieren."
            },
            {
                number: 4,
                description: "Öffne das Papier erneut und lege es mit der weißen Seite nach oben vor dich hin."
            },
            {
                number: 5,
                description: "Nimm eine Ecke des Papiers und falte sie zur gegenüberliegenden Ecke, sodass sich die Kanten treffen. Drücke die Falte fest."
            },
            {
                number: 6,
                description: "Wiederhole den vorherigen Schritt mit den anderen drei Ecken des Papiers, sodass du ein kleines Quadrat erhältst."
            },
            {
                number: 7,
                description: "Drehe das Quadrat um und falte es diagonal, sodass sich die Ecken in der Mitte treffen. Drücke die Falte fest."
            },
            {
                number: 8,
                description: "Nimm die beiden äußeren Ecken des Quadrats und falte sie nach oben, sodass sich die Kanten an der oberen Kante treffen. Drücke die Falte fest."
            },
            {
                number: 9,
                description: "Nimm den oberen Teil des Papiers und falte ihn nach unten, sodass sich die Kanten an der unteren Kante treffen. Drücke die Falte fest."
            },
            {
                number: 10,
                description: "Drehe das Papier um und wiederhole den vorherigen Schritt mit der anderen Seite."
            },
            {
                number: 11,
                description: "Nimm die untere Ecke des Papiers und falte sie nach oben, sodass sich die Kanten an der oberen Kante treffen. Drücke die Falte fest."
            },
            {
                number: 12,
                description: "Wiederhole den vorherigen Schritt mit der anderen Seite, sodass du eine Spitze erhältst."
            },
            {
                number: 13,
                description: "Greife an den seitlichen Kanten der Spitze und ziehe vorsichtig, um den Körper des Kranichs zu formen."
            },
            {
                number: 14,
                description: "Drücke die Falten vorsichtig, um den Kranich zu glätten und ihm die gewünschte Form zu geben."
            },
            {
                number: 15,
                description: "Jetzt hast du einen Origamikranich! Du kannst weitere Kraniche falten und sie beispielsweise als Dekoration verwenden oder an andere Personen verschenken. Origami ist eine wunderbare Kunstform, die Geduld und Geschicklichkeit erfordert. Viel Spaß beim Basteln!"
            },
        ]
    }
];

const users = [
    {
        username: "user_1234",
        email: "user_1234@example.com",
        password: " P@ssw0rd123",
        followers: [],
        following: [],
        favoritedPosts: [],
        posts: [],
        profilePicture: {
            data: fs.readFileSync(path.join(__dirname, './public/images/ProfilePictureDefault.jpeg')),
            contentType: 'image/png'
        }
    },
    {
        username: "john_doe",
        email: "john.doe@example.com",
        password: "Secret123!",
        followers: [],
        following: [],
        favoritedPosts: [],
        posts: [],
        profilePicture: {
            data: fs.readFileSync(path.join(__dirname, './public/images/dummyProfilePictures/John.jpg')),
            contentType: 'image/png'
        }
    },
    {
        username: "emma_watson",
        email: "emma_watson@example.com",
        password: "H3rmioneGr@nger",
        followers: [],
        following: [],
        favoritedPosts: [],
        posts: [],
        profilePicture: {
            data: fs.readFileSync(path.join(__dirname, './public/images/dummyProfilePictures/EmmaWatson.jpg')),
            contentType: 'image/png'
        }
    },
    {
        username: "coolcat",
        email: "coolcat@gmail.com",
        password: "MyPassw0rd!",
        followers: [],
        following: [],
        favoritedPosts: [],
        posts: [],
        profilePicture: {
            data: fs.readFileSync(path.join(__dirname, './public/images/dummyProfilePictures/coolcat.webp')),
            contentType: 'image/png'
        }
    },
    {
        username: "soccerstar24",
        email: "soccerstar24@hotmail.com",
        password: "Goal123#",
        followers: [],
        following: [],
        favoritedPosts: [],
        posts: [],
        profilePicture: {
            data: fs.readFileSync(path.join(__dirname, './public/images/dummyProfilePictures/SoccerStar.png')),
            contentType: 'image/png'
        }
    },
    {
        username: "bookworm89",
        email: "bookworm89@yahoo.com",
        password: "ReadingR0cks!",
        followers: [],
        following: [],
        favoritedPosts: [],
        posts: [],
        profilePicture: {
            data: fs.readFileSync(path.join(__dirname, './public/images/dummyProfilePictures/BookWorm.jpg')),
            contentType: 'image/png'
        }
    },
    {
        username: "fitnessguru",
        email: "fitnessguru@example.com",
        password: "Fit4Life$",
        followers: [],
        following: [],
        favoritedPosts: [],
        posts: [],
        profilePicture: {
            data: fs.readFileSync(path.join(__dirname, './public/images/dummyProfilePictures/Fitnessguru.jpg')),
            contentType: 'image/png'
        }
    }
];

function removeAllAndReplace() {
    Promise.all([
            User.deleteMany().exec(),
            Post.deleteMany().exec(),
        ])
        .then(() => {
            console.log("Deleted Everything");
            createData();
        })
        .catch(error => {
            console.log(error);
        })
}

function createData(){
    const postArray = [];
    const userArray = [];

    users.forEach((user) => {
        let newUser = new User({
            username: user.username,
            email: user.email,
            password: user.password,
            favoritedPosts: user.favoritedPosts,
            posts: user.posts,
            profilePicture: user.profilePicture
        });
        upload.single('default');
        userArray.push(User.register(newUser, user.password));
    });

    Promise.all(userArray)
        .then(users => {
            console.log("Created all dummy users");
            posts.forEach((post) => {
                const randomUser = users[Math.floor(Math.random() * users.length)]._id;
                postArray.push(Post.create({
                    title: post.title,
                    description: post.description,
                    img: post.img,
                    steps: post.steps,
                    user: randomUser,
                }));
            });
            Promise.all(postArray)
                .then(createdPosts => {
                    console.log("Created all dummy posts");
                    const finishedUsers = [];
                    createdPosts.forEach(post => {
                        finishedUsers.push(User.findByIdAndUpdate(post.user, {
                            $push: {posts: post._id}
                        }));
                    });
                    Promise.all(finishedUsers)
                        .then(() => {
                            console.log("Associated Users with Posts");
                            mongoose.connection.close();
                        })
                        .catch(error => {
                            console.log(`ERROR: ${error}`)
                            mongoose.connection.close();
                        });
                })
                .catch(error => {
                    console.log(`ERROR: ${error}`);
                    mongoose.connection.close();
                });
        })
        .catch(error => {
            console.log(`ERROR: ${error}`);
            mongoose.connection.close();
        })
}

removeAllAndReplace();
