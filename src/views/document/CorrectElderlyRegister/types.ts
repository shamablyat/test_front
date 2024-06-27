import { Component } from "vue";

export interface ITabs {
  component: Component;
  title: string;
  value: InOutTypes
}

export type InOutTypes = "inTables" | "outTables";
