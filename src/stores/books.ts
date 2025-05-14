import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  genre: string[];
  pages: number;
  year: number;
  rating: number;
  content: string;
}

export interface UserProgress {
  bookId: number;
  currentPage: number;
  totalPages: number;
  lastReadAt: Date;
  notes: { page: number; text: string }[];
}

// Реальные книги в общественном достоянии
const sampleBooks: Book[] = [
  {
    id: 1,
    title: 'Евгений Онегин',
    author: 'Александр Пушкин',
    cover: 'https://images.pexels.com/photos/3747463/pexels-photo-3747463.jpeg',
    description:
      '«Евгений Онегин» — роман в стихах русского писателя и поэта Александра Сергеевича Пушкина, написанный в 1823—1831 годах, одно из самых значительных произведений русской словесности.',
    genre: ['Классика', 'Поэзия', 'Роман в стихах'],
    pages: 224,
    year: 1833,
    rating: 4.8,
    content: `Мой дядя самых честных правил,
Когда не в шутку занемог,
Он уважать себя заставил
И лучше выдумать не мог.
Его пример другим наука;
Но, боже мой, какая скука
С больным сидеть и день и ночь,
Не отходя ни шагу прочь!...`,
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    cover: 'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg',
    description:
      'Социально-психологический и социально-философский роман Фёдора Михайловича Достоевского, над которым писатель работал в 1865—1866 годах.',
    genre: ['Классика', 'Роман', 'Психологический роман'],
    pages: 574,
    year: 1866,
    rating: 4.9,
    content: `В начале июля, в чрезвычайно жаркое время, под вечер, один молодой человек вышел из своей каморки, которую нанимал от жильцов в С-м переулке, на улицу и медленно, как бы в нерешимости, отправился к К-ну мосту...`,
  },
  {
    id: 3,
    title: 'Война и мир',
    author: 'Лев Толстой',
    cover: 'https://images.pexels.com/photos/3747464/pexels-photo-3747464.jpeg',
    description:
      'Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона в 1805—1812 годах.',
    genre: ['Классика', 'Исторический роман', 'Роман-эпопея'],
    pages: 1225,
    year: 1869,
    rating: 4.7,
    content: `В июле 1805 года в Петербурге в доме Анны Павловны Шерер, фрейлины и приближенной императрицы Марии Феодоровны, был большой вечер...`,
  },
  {
    id: 4,
    title: 'Мёртвые души',
    author: 'Николай Гоголь',
    cover: 'https://images.pexels.com/photos/3747466/pexels-photo-3747466.jpeg',
    description:
      'Поэма Николая Васильевича Гоголя, жанр которой сам автор определил как роман. Книга представляет собой сатирическое произведение о похождениях Чичикова.',
    genre: ['Классика', 'Сатира'],
    pages: 352,
    year: 1842,
    rating: 4.6,
    content: `В ворота гостиницы губернского города NN въехала довольно красивая рессорная небольшая бричка, в какой ездят холостяки...`,
  },
  {
    id: 5,
    title: 'Отцы и дети',
    author: 'Иван Тургенев',
    cover: 'https://images.pexels.com/photos/3747467/pexels-photo-3747467.jpeg',
    description:
      'Роман русского писателя Ивана Сергеевича Тургенева, написанный в 1860—1861 годах и опубликованный в 1862 году.',
    genre: ['Классика', 'Роман'],
    pages: 288,
    year: 1862,
    rating: 4.5,
    content: `– Что, Петр? не видать еще? – спрашивал 20-го мая 1859 года, выходя без шапки на низкое крылечко постоялого двора на *** шоссе, барин лет сорока с небольшим...`,
  },
  {
    id: 6,
    title: 'Доктор Живаго',
    author: 'Борис Пастернак',
    cover: 'https://images.pexels.com/photos/3747470/pexels-photo-3747470.jpeg',
    description:
      'Роман Бориса Пастернака, за который автор получил Нобелевскую премию по литературе. Произведение описывает судьбу интеллигенции в революционную эпоху.',
    genre: ['Классика', 'Исторический роман', 'Философский роман'],
    pages: 592,
    year: 1957,
    rating: 4.4,
    content: `Юра Живаго был еще мальчиком, когда умерла его мать. На похоронах он впервые почувствовал, что жизнь — это нечто большее, чем повседневные заботы...`,
  },
  {
    id: 7,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    cover: 'https://images.pexels.com/photos/3747471/pexels-photo-3747471.jpeg',
    description:
      'Мистико-сатирический роман Михаила Афанасьевича Булгакова, в котором переплетаются события в советской Москве и древнем Иерусалиме.',
    genre: ['Классика', 'Мистика', 'Сатира'],
    pages: 480,
    year: 1967,
    rating: 4.9,
    content: `Однажды весной, в час необычайно жаркого заката, в Москве, в Патриарших прудах, появились два человека...`,
  },
  {
    id: 8,
    title: 'Обломов',
    author: 'Иван Гончаров',
    cover: 'https://images.pexels.com/photos/3747472/pexels-photo-3747472.jpeg',
    description:
      'Роман Ивана Александровича Гончарова о русском дворянине Илье Ильиче Обломове, ставшем символом апатии и бездействия.',
    genre: ['Классика', 'Роман', 'Психологическая проза'],
    pages: 472,
    year: 1859,
    rating: 4.3,
    content: `В одном из домов на набережной Литейного проспекта в Петербурге в утренние часы лежал в постели Илья Ильич Обломов...`,
  },
  {
    id: 9,
    title: 'Герой нашего времени',
    author: 'Михаил Лермонтов',
    cover: 'https://images.pexels.com/photos/3747473/pexels-photo-3747473.jpeg',
    description:
      'Роман в новеллах Михаила Юрьевича Лермонтова, раскрывающий образ "лишнего человека" в лице Печорина — офицера с трагической судьбой.',
    genre: ['Классика', 'Роман', 'Психологическая проза'],
    pages: 224,
    year: 1840,
    rating: 4.6,
    content: `Я приехал в Пятигорск на водах. Как-то вечером, гуляя по бульвару, я услышал разговор двух офицеров...`,
  },
  {
    id: 10,
    title: 'Белая гвардия',
    author: 'Михаил Булгаков',
    cover: 'https://images.pexels.com/photos/3747474/pexels-photo-3747474.jpeg',
    description:
      'Первый роман Михаила Булгакова, посвящённый драматическим событиям гражданской войны и судьбе семьи Турбиных.',
    genre: ['Классика', 'Исторический роман', 'Военная проза'],
    pages: 352,
    year: 1925,
    rating: 4.2,
    content: `Ночь была холодная, звёздная. Над городом стояла тишина, и только в далёком пригороде слышались выстрелы...`,
  },
  {
    id: 11,
    title: 'На дне',
    author: 'Максим Горький',
    cover: 'https://images.pexels.com/photos/3747475/pexels-photo-3747475.jpeg',
    description:
      'Пьеса Максима Горького о жизни обитателей ночлежки, символизирующая духовное и социальное падение людей на дне общества.',
    genre: ['Классика', 'Драма', 'Пьеса'],
    pages: 160,
    year: 1902,
    rating: 4.1,
    content: `Ночлежка. Каменная комната с полом из грубых досок. У стены, на нарах, лежат люди, завернувшиеся в старые одеяла...`,
  },
  {
    id: 12,
    title: 'Чевенгур',
    author: 'Андрей Платонов',
    cover: 'https://images.pexels.com/photos/3747476/pexels-photo-3747476.jpeg',
    description:
      'Философский роман Андрея Платонова, описывающий утопический социалистический эксперимент в вымышленном городе Чевенгур.',
    genre: ['Классика', 'Философский роман', 'Социализм'],
    pages: 432,
    year: 1928,
    rating: 4.4,
    content: `Саша Дванов, ещё мальчиком, жил с отцом, который однажды привязал к себе камень и ушёл в озеро...`,
  },
  {
    id: 13,
    title: 'Записки из подполья',
    author: 'Фёдор Достоевский',
    cover: 'https://images.pexels.com/photos/3747477/pexels-photo-3747477.jpeg',
    description:
      'Философская повесть, в которой герой, отвергая общество, уходит в "подполье" — метафору внутреннего мира отчуждённого человека.',
    genre: ['Классика', 'Философская проза', 'Психология'],
    pages: 192,
    year: 1864,
    rating: 4.7,
    content: `Я человек больной... Я злой человек. Непривлекательный я человек. Мне кажется, у меня болит печень...`,
  },
  {
    id: 14,
    title: 'Руслан и Людмила',
    author: 'Александр Пушкин',
    cover: 'https://images.pexels.com/photos/3747478/pexels-photo-3747478.jpeg',
    description:
      'Поэма-сказка Александра Сергеевича Пушкина, основанная на фольклорных мотивах и рассказывающая о приключениях богатыря Руслана.',
    genre: ['Классика', 'Поэзия', 'Сказка'],
    pages: 160,
    year: 1820,
    rating: 4.3,
    content: `У лукоморья дуб зелёный;
Златая цепь на дубе том:
И днём и ночью кот учёный
Всё ходит по цепи кругом...`,
  },
  {
    id: 15,
    title: 'Хождение по мукам',
    author: 'Алексей Толстой',
    cover: 'https://images.pexels.com/photos/3747479/pexels-photo-3747479.jpeg',
    description:
      'Эпопея о судьбе интеллигенции в годы Первой мировой, революции и гражданской войны в России.',
    genre: ['Классика', 'История', 'Революция'],
    pages: 768,
    year: 1941,
    rating: 4.2,
    content: `Сестрорецкий завод, шум станков и запах железа. На фоне военной разрухи герои ищут смысл и любовь...`,
  },
  {
    id: 16,
    title: 'Золотой телёнок',
    author: 'Илья Ильф и Евгений Петров',
    cover: 'https://images.pexels.com/photos/3747480/pexels-photo-3747480.jpeg',
    description:
      'Юмористический роман, продолжение «Двенадцати стульев», где Остап Бендер гоняется за миллионом советских рублей.',
    genre: ['Классика', 'Сатира', 'Приключения'],
    pages: 416,
    year: 1931,
    rating: 4.6,
    content: `Остап Бендер снова в деле. Он объявляет охоту на миллионера Александра Ивановича Корейко...`,
  },
  {
    id: 17,
    title: 'Лолита',
    author: 'Владимир Набоков',
    cover: 'https://images.pexels.com/photos/3747481/pexels-photo-3747481.jpeg',
    description:
      'Скандальный и гениальный роман о запретной любви, написанный Набоковым на английском и позже переведённый им на русский язык.',
    genre: ['Классика', 'Драма', 'Психология'],
    pages: 336,
    year: 1955,
    rating: 4.3,
    content: `Лолита, свет моей жизни, огонь моих чресл. Грех мой, душа моя. Ло-ли-та: кончик языка совершает путь в три шага по нёбу...`,
  },
  {
    id: 18,
    title: 'Тихий Дон',
    author: 'Михаил Шолохов',
    cover: 'https://images.pexels.com/photos/3747482/pexels-photo-3747482.jpeg',
    description:
      'Эпическая сага о донском казачестве, революции и Гражданской войне, принесшая автору Нобелевскую премию.',
    genre: ['Классика', 'Исторический роман', 'Военная проза'],
    pages: 1168,
    year: 1940,
    rating: 4.5,
    content: `На востоке небо чуть посветлело, и над Доном, точно разорванные клочья, стелился туман...`,
  },
  {
    id: 19,
    title: 'Капитанская дочка',
    author: 'Александр Пушкин',
    cover: 'https://images.pexels.com/photos/3747483/pexels-photo-3747483.jpeg',
    description:
      'Историческая повесть о Пугачёвском восстании, любви и чести, написанная простым, но выразительным языком.',
    genre: ['Классика', 'История', 'Повесть'],
    pages: 192,
    year: 1836,
    rating: 4.6,
    content: `Отец мой, Андрей Петрович Гринёв, в молодости служил при графе Минихе и вышел в отставку в чине премьер-майора...`,
  },
  {
    id: 20,
    title: 'Записки охотника',
    author: 'Иван Тургенев',
    cover: 'https://images.pexels.com/photos/3747484/pexels-photo-3747484.jpeg',
    description:
      'Сборник рассказов, передающих дух русской природы и судьбы крестьян глазами барина-охотника.',
    genre: ['Классика', 'Проза', 'Рассказ'],
    pages: 400,
    year: 1852,
    rating: 4.4,
    content: `Судьба забросила меня на ночь в деревню Глухово. Я остановился у крестьянина, добродушного старика...`,
  },
  {
    id: 21,
    title: 'Обломов',
    author: 'Иван Гончаров',
    cover: 'https://images.pexels.com/photos/3747485/pexels-photo-3747485.jpeg',
    description:
      'Роман о русском дворянине Илье Обломове, о его лени, мечтательности и неспособности к действию. Символ «обломовщины» в русской культуре.',
    genre: ['Классика', 'Психология', 'Философский роман'],
    pages: 560,
    year: 1859,
    rating: 4.4,
    content: `В квартире Ильи Ильича Обломова всё дышало покоем. Сам хозяин лежал на диване, завернувшись в халат...`,
  },
  {
    id: 22,
    title: 'Белая гвардия',
    author: 'Михаил Булгаков',
    cover: 'https://images.pexels.com/photos/3747486/pexels-photo-3747486.jpeg',
    description:
      'Роман о гражданской войне в Киеве, отражающий судьбы русской интеллигенции, переживающей хаос революции.',
    genre: ['Классика', 'История', 'Драма'],
    pages: 320,
    year: 1925,
    rating: 4.5,
    content: `Над Киевом в декабре 1918 года стояла серая мгла. Всё было неустойчиво — власть, жизнь, будущее...`,
  },
  {
    id: 23,
    title: 'Записки из Мёртвого дома',
    author: 'Фёдор Достоевский',
    cover: 'https://images.pexels.com/photos/3747487/pexels-photo-3747487.jpeg',
    description:
      'Автобиографическая повесть Достоевского о жизни каторжан в сибирской тюрьме, основанная на личном опыте автора.',
    genre: ['Классика', 'Документальная проза', 'Психология'],
    pages: 384,
    year: 1861,
    rating: 4.6,
    content: `Всё началось с этапа. Замерзшие дороги, конвоиры, кандалы... Я стал узником каторжной тюрьмы. И началась новая жизнь.`,
  },
  {
    id: 24,
    title: 'Палата №6',
    author: 'Антон Чехов',
    cover: 'https://images.pexels.com/photos/3747488/pexels-photo-3747488.jpeg',
    description:
      'Повесть о враче, который начинает сомневаться в границе между нормальностью и безумием, постепенно сближаясь с пациентами психиатрической палаты.',
    genre: ['Классика', 'Философия', 'Психология'],
    pages: 96,
    year: 1892,
    rating: 4.5,
    content: `В уездной больнице стояло ветхое здание, в нём находилась палата №6 — приют для душевнобольных...`,
  },
  {
    id: 25,
    title: 'Мы',
    author: 'Евгений Замятин',
    cover: 'https://images.pexels.com/photos/3747489/pexels-photo-3747489.jpeg',
    description:
      'Антиутопический роман о будущем тоталитарного государства, в котором личности подавлены, а свобода запрещена.',
    genre: ['Классика', 'Антиутопия', 'Фантастика'],
    pages: 256,
    year: 1920,
    rating: 4.3,
    content: `Я — Д-503, строитель Интеграла. Математик, верящий в рациональность. Но в мир проникает хаос — и женщина по имени I-330...`,
  },
  {
    id: 26,
    title: 'Пиковая дама',
    author: 'Александр Пушкин',
    cover: 'https://images.pexels.com/photos/3747490/pexels-photo-3747490.jpeg',
    description:
      'Готическая повесть о страсти к азартным играм и роковом предсказании. Классика русской мистической прозы.',
    genre: ['Классика', 'Мистика', 'Повесть'],
    pages: 64,
    year: 1834,
    rating: 4.6,
    content: `Тройка, семёрка, туз... Вот секрет графини, о котором мечтает Германн. Но игра — всегда риск...`,
  },
  {
    id: 27,
    title: 'Республика ШКИД',
    author: 'Григорий Белых и Л. Пантелеев',
    cover: 'https://images.pexels.com/photos/3747491/pexels-photo-3747491.jpeg',
    description:
      'Полуавтобиографический роман о жизни беспризорников и педагогов в школе-коммуне в Петрограде 1920-х годов.',
    genre: ['Классика', 'Приключения', 'Подростковая литература'],
    pages: 352,
    year: 1927,
    rating: 4.5,
    content: `На улице стояла зима, а в школе ШКИД царила шумная жизнь, полная шалостей, борьбы и взросления...`,
  },
  {
    id: 28,
    title: 'Обыкновенная история',
    author: 'Иван Гончаров',
    cover: 'https://images.pexels.com/photos/3747492/pexels-photo-3747492.jpeg',
    description:
      'Роман о разочаровании молодого мечтателя, приехавшего из провинции в Петербург и столкнувшегося с реальностью.',
    genre: ['Классика', 'Психология', 'Роман'],
    pages: 512,
    year: 1847,
    rating: 4.2,
    content: `Александр Адуев полон надежд. Он приезжает к своему дяде и постепенно сталкивается с циничным миром больших людей...`,
  },
  {
    id: 29,
    title: 'Жизнь Арсеньева',
    author: 'Иван Бунин',
    cover: 'https://images.pexels.com/photos/3747493/pexels-photo-3747493.jpeg',
    description:
      'Автобиографический роман Ивана Бунина о детстве, юности и жизненном пути чувствительного и наблюдательного героя.',
    genre: ['Классика', 'Автобиография', 'Философия'],
    pages: 448,
    year: 1930,
    rating: 4.4,
    content: `Детство Арсеньева прошло в родовом имении. Время текло среди садов, звуков скрипки и мыслей о вечном...`,
  },
  {
    id: 30,
    title: 'Доктор Живаго',
    author: 'Борис Пастернак',
    cover: 'https://images.pexels.com/photos/3747494/pexels-photo-3747494.jpeg',
    description:
      'Роман-эпопея о судьбе врача и поэта Юрия Живаго на фоне революции и Гражданской войны. Лирическое произведение о любви и трагедии.',
    genre: ['Классика', 'Роман', 'История'],
    pages: 592,
    year: 1957,
    rating: 4.6,
    content: `Юрий Живаго в поисках истины, любви и покоя. Судьба бросает его в водоворот революций и разлук...`,
  },
];

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>(sampleBooks);
  const userProgress = ref<UserProgress[]>([]);
  const searchQuery = ref('');
  const selectedGenre = ref('');

  // Initialize user progress from localStorage
  function initUserProgress() {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated && authStore.currentUser) {
      const userId = authStore.currentUser.id;
      const savedProgress = localStorage.getItem(`userProgress_${userId}`);

      if (savedProgress) {
        try {
          const progressData = JSON.parse(savedProgress);
          userProgress.value = progressData.map((item: any) => ({
            ...item,
            lastReadAt: new Date(item.lastReadAt),
          }));
        } catch (e) {
          console.error('Failed to parse user progress', e);
        }
      }
    }
  }

  // Save progress to localStorage
  function saveProgress() {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated && authStore.currentUser) {
      const userId = authStore.currentUser.id;
      localStorage.setItem(
        `userProgress_${userId}`,
        JSON.stringify(userProgress.value)
      );
    }
  }

  // Get book by ID
  const getBook = (id: number) => {
    return books.value.find((book) => book.id === id) || null;
  };

  // Get book progress
  const getBookProgress = (bookId: number) => {
    return userProgress.value.find((p) => p.bookId === bookId) || null;
  };

  // Update reading progress
  function updateProgress(bookId: number, currentPage: number) {
    const book = getBook(bookId);
    if (!book) return;

    const existingProgress = getBookProgress(bookId);

    if (existingProgress) {
      existingProgress.currentPage = currentPage;
      existingProgress.lastReadAt = new Date();
    } else {
      userProgress.value.push({
        bookId,
        currentPage,
        totalPages: book.pages,
        lastReadAt: new Date(),
        notes: [],
      });
    }

    saveProgress();
  }

  // Add note
  function addNote(bookId: number, page: number, text: string) {
    const progress = getBookProgress(bookId);

    if (progress) {
      progress.notes.push({ page, text });
    } else {
      const book = getBook(bookId);
      if (book) {
        userProgress.value.push({
          bookId,
          currentPage: page,
          totalPages: book.pages,
          lastReadAt: new Date(),
          notes: [{ page, text }],
        });
      }
    }

    saveProgress();
  }

  // Get reading statistics
  const readingStats = computed(() => {
    const totalBooks = userProgress.value.length;
    const booksInProgress = userProgress.value.filter(
      (p) => p.currentPage > 0 && p.currentPage < p.totalPages
    ).length;
    const completedBooks = userProgress.value.filter(
      (p) => p.currentPage >= p.totalPages
    ).length;

    const totalPages = userProgress.value.reduce(
      (sum, p) => sum + p.currentPage,
      0
    );

    return {
      totalBooks,
      booksInProgress,
      completedBooks,
      totalPages,
    };
  });

  // Get recent books (last read)
  const recentBooks = computed(() => {
    return [...userProgress.value]
      .sort((a, b) => b.lastReadAt.getTime() - a.lastReadAt.getTime())
      .slice(0, 5)
      .map((progress) => {
        const book = getBook(progress.bookId);
        return {
          ...book,
          progress: Math.floor(
            (progress.currentPage / progress.totalPages) * 100
          ),
        };
      })
      .filter((book) => book !== null);
  });

  // Get book recommendations based on genres of books the user has read
  const recommendations = computed(() => {
    const readBookIds = userProgress.value.map((p) => p.bookId);
    const readBooks = books.value.filter((book) =>
      readBookIds.includes(book.id)
    );

    const userGenres = readBooks.flatMap((book) => book.genre);

    let recommendedBooks = books.value
      .filter((book) => !readBookIds.includes(book.id))
      .map((book) => {
        const matchingGenres = book.genre.filter((g) => userGenres.includes(g));
        return {
          ...book,
          relevance: matchingGenres.length,
        };
      })
      .filter((book) => book.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);

    if (recommendedBooks.length === 0) {
      recommendedBooks = books.value
        .filter((book) => !readBookIds.includes(book.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
    }

    return recommendedBooks;
  });

  // Filtered books based on search and genre
  const filteredBooks = computed(() => {
    let filtered = books.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    if (selectedGenre.value) {
      filtered = filtered.filter((book) =>
        book.genre.some(
          (g) => g.toLowerCase() === selectedGenre.value.toLowerCase()
        )
      );
    }

    return filtered;
  });

  // Get all available genres
  const allGenres = computed(() => {
    const genreSet = new Set<string>();

    books.value.forEach((book) => {
      book.genre.forEach((g) => genreSet.add(g));
    });

    return Array.from(genreSet).sort();
  });

  return {
    books,
    userProgress,
    searchQuery,
    selectedGenre,
    filteredBooks,
    allGenres,
    recentBooks,
    recommendations,
    readingStats,
    getBook,
    getBookProgress,
    updateProgress,
    addNote,
    initUserProgress,
  };
});
