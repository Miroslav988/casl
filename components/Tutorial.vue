<template>
  <div>
    <select v-model="userData.role">
      <option value="Text">Главный по текстам</option>
      <option value="links">Главный по ссылкам</option>
    </select>
    <div class="form-container">
      <form v-if="canManageText">
        <button @click="saveText($event)" type="submit">
          {{ textData.btnContent }}
        </button>
        <input v-model="inputText" type="text" placeholder="Введите текст" />
      </form>
      <form v-if="canManageLinks">
        <button type="submit" @click="saveLink($event)">
          {{ linksData.btnContent }}
        </button>
        <input v-model="inputLink" type="text" placeholder="Вставте ссылку" />
      </form>
    </div>
    <h3>Тексты и Ссылки</h3>
    <div class="manageCont">
      <div>
        <input
          v-model="textSearch"
          type="text"
          placeholder="Поиск по текстам"
        />
        <button @click="sortTexts('asc')">Сортировать текст ↑</button>
        <button @click="sortTexts('desc')">Сортировать текст ↓</button>
      </div>

      <div>
        <input
          v-model="linkSearch"
          type="text"
          placeholder="Поиск по ссылкам"
        />
        <button @click="sortLinks('asc')">Сортировать ссылки ↑</button>
        <button @click="sortLinks('desc')">Сортировать ссылки ↓</button>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Текст</th>
          <th>Ссылка</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(text, index) in filteredTexts" :key="'row-' + index">
          <td @click="userData.role === 'Text' ? editText(index) : null">
            {{ text }}
          </td>
          <td @click="userData.role === 'links' ? editLink(index) : null">
            {{ filteredLinks[index] || "" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ability from "~/plugins/ability";
import { Text, Links } from "~/plugins/entities";
export default {
  // начальные значения
  data() {
    return {
      userData: { role: "Text" }, // Пример данных пользователя
      inputText: "",
      inputLink: "",
      textData: null,
      linksData: null,
      editing: false,
      currentEditIndex: null,
      textSearch: "",
      linkSearch: "",
    };
  },
  // задаем значения для рендера
  created() {
    (this.textData = new Text({
      // создаем новый объект класса, чтобы разграничивать роли
      btnContent: "Добавить текст",
      texts: ["Hello World, I'm Text!"],
    })),
      (this.linksData = new Links({
        btnContent: "Добавить ссылку",
        links: ["Hello World, I'm Link!"],
      }));
  },
  methods: {
    //обычные добавления
    addText() {
      if (this.inputText) {
        this.textData.texts.push(this.inputText);
        this.inputText = ""; // Очистка поля ввода
      }
    },
    addLink() {
      if (this.inputLink) {
        this.linksData.links.push(this.inputLink);
        this.inputLink = ""; // Очистка поля ввода
      }
    },
    // связка редактирования и сохранения данных
    editText(index) {
      this.editing = true;
      this.inputText = this.filteredTexts[index];
      this.currentEditIndex = this.textData.texts.indexOf(
        this.filteredTexts[index]
      );
    },
    saveText(event) {
      event.preventDefault();
      if (this.currentEditIndex !== null) {
        this.textData.texts[this.currentEditIndex] = this.inputText;
        this.inputText = "";
        this.editing = false;
        this.currentEditIndex = null;
      } else {
        this.addText();
      }
    },
    editLink(index) {
      this.editing = true; // Устанавливаем режим редактирования
      this.inputLink = this.filteredLinks[index]; // Устанавливаем значение в input
      this.currentEditIndex = this.linksData.links.indexOf(
        this.filteredLinks[index]
      );
    },
    saveLink(event) {
      event.preventDefault();
      if (this.currentEditIndex !== null) {
        this.linksData.links[this.currentEditIndex] = this.inputLink; // Обновляем значение в массиве
        this.inputLink = "";
        this.editing = false; // Сбрасываем режим редактирования
        this.currentEditIndex = null; // Сбрасываем индекс редактируемого элемента
      } else {
        this.addLink();
      }
    },
    sortTexts(order) {
      this.textData.texts.sort((a, b) => {
        return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
      });
    },
    sortLinks(order) {
      this.linksData.links.sort((a, b) => {
        return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
      });
    },
  },
  // полуаем нужную роль и ее возможности
  computed: {
    ability() {
      return ability(this.userData);
    },
    canManageText() {
      return this.ability.can("manage", this.textData);
    },
    canManageLinks() {
      return this.ability.can("manage", this.linksData);
    },
    filteredTexts() {
      return this.textData.texts.filter((text) =>
        text.includes(this.textSearch)
      );
    },
    filteredLinks() {
      return this.linksData.links.filter((link, index) => {
        return link.includes(this.linkSearch);
      });
    },
  },
  // отображение изменений в данных напрямую
  watch: {
    inputText(newValue) {
      if (this.currentEditIndex !== null) {
        this.filteredTexts[this.currentEditIndex] = newValue; // Обновляем текст в массиве
      }
    },
    inputLink(newValue) {
      if (this.currentEditIndex !== null) {
        this.filteredLinks[this.currentEditIndex] = newValue; // Обновляем ссылку в массиве
      }
    },
  },
};
</script>
<style>
.manageCont {
  display: flex;
  justify-content: space-between;
}
.form-container {
  display: flex; /* Используем Flexbox */
  gap: 20px; /* Промежуток между формами */
}

form {
  display: flex;
  flex-direction: column; /* Вертикальное расположение элементов внутри формы */
}
table {
  width: 100%;
  border-collapse: collapse; /* Убирает двойные границы между ячейками */
}

th,
td {
  border: 1px solid black; /* Добавляет границы ячейкам */
  padding: 8px; /* Добавляет отступы внутри ячеек */
  text-align: left; /* Выравнивание текста в ячейках */
}

th {
  background-color: #f2f2f2; /* Цвет фона для заголовков */
}
</style>
