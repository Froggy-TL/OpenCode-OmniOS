import { defineStore } from "pinia";
import { ref } from "vue";

export interface UIComponent {
  type: string;
  props?: Record<string, any>;
  children?: UIComponent[];
}

export const useLayoutStore = defineStore("layout", () => {
  const dynamicLayout = ref<UIComponent[]>([]);

  function setLayout(layout: UIComponent[]) {
    dynamicLayout.value = layout;
  }

  return { dynamicLayout, setLayout };
});
