На первый взгляд, проект работает, но необходимо провести более глубокие тесты для подтверждения его стабильности. Также стоит доработать пользовательский интерфейс и разобраться с тем, как обращаться с классами из файла entities.js, для чего рекомендуется почитать дополнительную документацию.
решил сразу разобраться с библиотекой casl, которую обсуждали на созвоне, не скажу, что это было просто, но вроде бы справился
главная проблема заключалась в nuxt, которй работает на vue 2, а рабочий и доступный npm casl есть только на vue 3, обновление vue@latest так же не спасает ситуацию, тк vue-router будет не совпадать по версии.
пришлось работать с отдельным npm casl и настраивать его вручную.

Чтобы запустить проект, выполните команду npm run dev в корневом каталоге, а затем запустите nodemon server.js в папке backend.
