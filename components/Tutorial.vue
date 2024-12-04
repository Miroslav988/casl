<template>
  <div>
    <select v-model="userData.role">
      <option value="Text">Главный по текстам</option>
      <option value="links">Главный по ссылкам</option>
    </select>
    <div class="form-container">
      <form v-if="canManageText" @submit.prevent="saveText">
        <button type="submit">
          {{ editing ? "Сохранить" : "Добавить" }}
        </button>
        <input v-model="inputText" type="text" placeholder="Введите текст" />
      </form>
      <form v-if="canManageLinks" @submit.prevent="saveLink">
        <button type="submit">
          {{ editing ? "Сохранить" : "Добавить" }}
        </button>
        <input v-model="inputLink" type="text" placeholder="Вставте ссылку" />
      </form>
    </div>
    <div class="tableCont">
      <div class="infoCont">
        <h3>Тексты</h3>
        <div class="manageCont">
          <input
            v-model="textSearch"
            type="text"
            placeholder="Поиск по текстам"
          />
          <button @click="sortTexts('asc')">Сортировать текст ↑</button>
          <button @click="sortTexts('desc')">Сортировать текст ↓</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Текст</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(text, index) in filteredTexts"
              :key="'text-row-' + index"
            >
              <td @click="userData.role === 'Text' ? editText(index) : null">
                {{ text.text }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="infoCont">
        <h3>Ссылки</h3>
        <div class="manageCont">
          <input
            v-model="linkSearch"
            type="text"
            placeholder="Поиск по ссылкам"
          />
          <button @click="sortLinks('asc')">Сортировать ссылки ↑</button>
          <button @click="sortLinks('desc')">Сортировать ссылки ↓</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ссылка</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(link, index) in filteredLinks"
              :key="'link-row-' + index"
            >
              <td @click="userData.role === 'links' ? editLink(index) : null">
                <a :href="link.url">{{ link.url }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ability from "~/plugins/ability";
import { Text, Links } from "~/plugins/entities";
export default {
  // начальные значения
  data() {
    return {
      userData: { role: "Text" },
      inputText: "",
      inputLink: "",
      textData: null,
      linksData: null,
      editing: false,
      currentEditIndex: null,
      texts: [],
      links: [],
      textSearch: "",
      linkSearch: "",
    };
  },
  // задаем значения для рендера
  created() {
    this.fetchTexts();
    this.fetchLinks();
    (this.textData = new Text({ texts: [] })),
      (this.linksData = new Links({ links: [] }));
  },
  methods: {
    async fetchTexts() {
      await axios
        .get("http://localhost:8080/texts")
        .then((response) => {
          this.texts = response.data.map((item) => new Text(item)); // Создаем экземпляры класса Text
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async fetchLinks() {
      await axios
        .get("http://localhost:8080/links")
        .then((response) => {
          this.links = response.data.map((item) => new Links(item)); // Создаем экземпляры класса Links
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addText() {
      if (this.inputText) {
        const newText = { id: Date.now().toString(), text: this.inputText };
        axios
          .post("http://localhost:8080/texts", newText)
          .then(() => {
            this.fetchTexts();
            this.inputText = "";
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    addLink() {
      if (this.inputLink && this.isValidUrl(this.inputLink)) {
        const newLink = { id: Date.now().toString(), url: this.inputLink };
        axios
          .post("http://localhost:8080/links", newLink)
          .then(() => {
            this.fetchLinks();
            this.inputLink = "";
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        alert("Введите корректный URL.");
      }
    },
    editText(index) {
      this.editing = true;
      this.inputText = this.texts[index].text;
      this.currentEditIndex = index;
    },
    saveText() {
      if (this.currentEditIndex !== null) {
        const updatedText = {
          ...this.texts[this.currentEditIndex],
          text: this.inputText,
        };
        axios
          .put(`http://localhost:8080/texts/${updatedText.id}`, updatedText)
          .then(() => {
            this.fetchTexts();
            this.inputText = "";
            this.editing = false;
            this.currentEditIndex = null;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.addText();
      }
    },
    editLink(index) {
      this.editing = true;
      this.inputLink = this.links[index].url;
      this.currentEditIndex = index;
    },
    saveLink() {
      if (this.currentEditIndex !== null) {
        const updatedLink = {
          ...this.links[this.currentEditIndex],
          url: this.inputLink,
        };
        axios
          .put(`http://localhost:8080/links/${updatedLink.id}`, updatedLink)
          .then(() => {
            this.fetchLinks();
            this.inputLink = "";
            this.editing = false;
            this.currentEditIndex = null;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.addLink();
      }
    },
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    },
    sortTexts(order) {
      this.texts.sort((a, b) => {
        return order === "asc"
          ? a.text.localeCompare(b.text)
          : b.text.localeCompare(a.text);
      });
    },
    sortLinks(order) {
      this.links.sort((a, b) => {
        return order === "asc"
          ? a.url.localeCompare(b.url)
          : b.url.localeCompare(a.url);
      });
    },
  },
  computed: {
    ability() {
      return ability(this.userData);
    },
    canManageText() {
      return this.ability.can("manage", this.texts[0]);
    },
    canManageLinks() {
      return this.ability.can("manage", this.links[0]);
    },
    filteredTexts() {
      return this.texts.filter((text) => text.text.includes(this.textSearch));
    },
    filteredLinks() {
      return this.links.filter((link) => link.url.includes(this.linkSearch));
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
.tableCont {
  display: flex;
  width: 100%;
}
.infoCont {
  width: 50%;
  display: flex;
  flex-direction: column;
}
.manageCont {
  display: flex;
  justify-content: space-between;
}
.form-container {
  display: flex;
  gap: 20px;
}

form {
  display: flex;
  flex-direction: column;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
