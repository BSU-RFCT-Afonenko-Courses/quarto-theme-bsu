# Тема БГУ для Quarto

`bsu-theme` — независимый пакет оформления HTML-книг и слайдов Reveal.js.
Он принадлежит `BSU-RFCT-Afonenko-Courses/quarto-theme-bsu`; инструменты учебной
разметки развиваются отдельно в организации `Afonenko-Course-Tools`.

## Установка и включение

```sh
quarto add BSU-RFCT-Afonenko-Courses/quarto-theme-bsu
```

В `_quarto.yml` или отдельном файле, подключённом через `metadata-files`, явно
выберите ресурсы темы. При установке из GitHub Quarto добавляет каталог владельца:

```yaml
brand: _extensions/BSU-RFCT-Afonenko-Courses/bsu-theme/_brand.yml
format:
  html:
    theme:
      - cosmo
      - brand
      - _extensions/BSU-RFCT-Afonenko-Courses/bsu-theme/styles/common.scss
      - _extensions/BSU-RFCT-Afonenko-Courses/bsu-theme/styles/book.scss
  revealjs:
    theme:
      - default
      - brand
      - _extensions/BSU-RFCT-Afonenko-Courses/bsu-theme/styles/common.scss
      - _extensions/BSU-RFCT-Afonenko-Courses/bsu-theme/styles/slides.scss
```

Оставьте необходимые форматы. При установке из локального каталога путь обычно
имеет вид `_extensions/bsu-theme/`; сверяйте его с результатом `quarto add`.
Каждый SCSS-файл перечисляется один раз. Стандартные форматы `html` и `revealjs`
сохраняются: собственный формат документа тема не вводит.

## Границы и устройство

| Файл | Ответственность |
|---|---|
| `_brand.yml` | Палитра и типографика |
| `styles/common.scss` | CSS-переменные бренда и оформления компонентов |
| `styles/book.scss` | Книга, оглавление и обычные HTML-страницы |
| `styles/slides.scss` | Компоновка и типографика Reveal.js |

Пакет не содержит Lua-фильтров, JavaScript, обработчиков сборки и контрактов
заданий. Установка не включает тему автоматически. Учебную семантику, скрытие
ответов, навигацию и ссылки предоставляют отдельно подключённые расширения.
В авторской разметке не требуются классы `.bsu-*`.

Оформление сторонних компонентов согласуется через публичные CSS-переменные
`--course-*` и `--course-nav-*`. При их отсутствии тема работает с обычными
элементами Quarto. SCSS — исходный слой, из которого Quarto получает CSS;
пакет можно использовать без учебной модели, CUE, Cloud и PrairieLearn.

Палитра перенесена из предоставленного брендбука БГУ; Arial используется как
резервный шрифт. Закрытые шрифты и официальный логотип в пакет не включены.
Тема не заявляет официальное утверждение университетом.

SCSS оформляет HTML и браузерную печать. PDF через LaTeX и Beamer требует
отдельного шаблона, который здесь не реализован. `_brand.yml` можно использовать
в форматах Quarto, поддерживающих механизм brand, но специальная компоновка
этого пакета проверяется для HTML и Reveal.js.

## Пример и проверка

```sh
cd examples/course
quarto add ../.. --no-prompt
quarto render
```

Пример содержит обычную страницу и презентацию, использует только этот пакет
и собирается без остальных репозиториев. Проверка из корня:

```sh
quarto run tests/check.ts
```

CI проверяет установку, сборку обоих форматов и самостоятельность темы в
актуальных каналах Quarto `release` и `pre-release`.
