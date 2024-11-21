<template>
  <aside class="w-64">
    <section>
      <ul>
        <li>
          <nuxt-link to="desktop"><span>我的文件</span></nuxt-link>
        </li>
        <li>
          <nuxt-link to="favorite"><span>我的收藏</span></nuxt-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup></script>

<style lang="less" scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
aside {
  @apply w-64 h-full bg-gray-50;
  section {
    @apply overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800;

    ul {
      @apply space-y-2;
      li {
        a {
          @apply flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700;

          span {
            @apply ml-3;
          }
        }
      }
    }
  }

  .router-link-exact-active {
    @apply bg-blue-600 font-bold text-white hover:bg-blue-700;
  }
}
</style>
