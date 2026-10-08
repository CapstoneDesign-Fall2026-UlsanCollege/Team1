<script setup lang="ts">
defineProps<{ name: string }>()
const paths: Record<string, string> = {
  edit: 'm16 3 5 5-12 12-6 1 1-6ZM14 5l5 5',
  add: 'M12 4v16M4 12h16',
  refresh: 'M20 7a9 9 0 1 0 1 8M20 2v5h-5',
  remove: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  save: 'M4 3h13l4 4v14H3V3ZM7 3v6h10V3M7 21v-8h10v8',
  cancel: 'm5 5 14 14M19 5 5 19',
  expand: 'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5',
  logout: 'M9 3H3v18h6M9 12h12m-5-5 5 5-5 5',
  profile: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  semester: 'M4 5h16v16H4ZM8 2v6M16 2v6M4 10h16',
  course: 'M12 6v15M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Z',
  schedule: 'M4 12V5h16v6M8 2v6M16 2v6M4 10h12M13 17a5 5 0 1 0 10 0 5 5 0 0 0-10 0ZM18 14v3l2 1M4 15h5M4 19h5',
  jobs: 'M3 7h18v14H3ZM8 7V3h8v4M3 12c5 4 13 4 18 0M10 13h4v4h-4Z',
  home: 'm2 11 10-9 10 9M5 9v13h5v-8h4v8h5V9',
  settings: 'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  back: 'm15 4-8 8 8 8',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 7 7',
}
</script>
<template><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="paths[name] || paths.course" /></svg></template>
