<script lang="ts">
  interface Props {
    name: string;
    size?: number;
    class?: string;
  }
  let { name, size = 24, class: className = '' }: Props = $props();
</script>

<i
  class="hn hn-{name} {className}"
  style="font-size: {size}px; width: {size}px; height: {size}px; display: inline-flex; align-items: center; justify-content: center;"
></i>
