<template>
  <template v-for="(comp, index) in schema" :key="index">
    <component
      :is="resolveComponent(comp.type)"
      v-bind="comp.props"
    >
      <DynamicRenderer v-if="comp.children" :schema="comp.children" />
      {{ comp.props?.text }}
    </component>
  </template>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const componentsMap: Record<string, any> = {
  Button,
  Card,
  CardContent,
  CardTitle
};

defineProps<{ schema: any[] }>();

const resolveComponent = (type: string) => componentsMap[type] || "div";
</script>
