<script lang="ts">
  import './FeedbackPopup.css';

  interface Props {
    text: string;
    color: string;
    visible: boolean;
  }

  let { text, color, visible }: Props = $props();
</script>

{#if visible}
  <div class="feedback-popup" style="color: {color}">
    {text}
  </div>
{/if}
