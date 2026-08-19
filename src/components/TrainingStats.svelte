<script lang="ts">
  import { GOOD_SCORE_THRESHOLD, OK_SCORE_THRESHOLD } from '../config/constants';
  import type { TrainingStats } from '../types';

  interface Props {
    accuracyStats: TrainingStats | null;
    missedHits: number;
  }

  let { accuracyStats, missedHits }: Props = $props();
</script>

{#if accuracyStats}
  <div class="fs-stat">
    <span class="fs-stat-label">Acc</span>
    <span class="fs-stat-value {accuracyStats.score >= GOOD_SCORE_THRESHOLD ? 'good' : accuracyStats.score >= OK_SCORE_THRESHOLD ? 'ok' : 'bad'}">
      {accuracyStats.score}%
    </span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Perfect</span>
    <span class="fs-stat-value perfect">{accuracyStats.perfect}</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Good</span>
    <span class="fs-stat-value good">{accuracyStats.good}</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Off</span>
    <span class="fs-stat-value off">{accuracyStats.off}</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Extra</span>
    <span class="fs-stat-value miss">{accuracyStats.miss}</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Missed</span>
    <span class="fs-stat-value miss">{missedHits}</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Total</span>
    <span class="fs-stat-value total">{accuracyStats.total}</span>
  </div>
{:else}
  <div class="fs-stat">
    <span class="fs-stat-label">Acc</span>
    <span class="fs-stat-value" style="color: #555">-</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Perfect</span>
    <span class="fs-stat-value" style="color: #555">-</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Good</span>
    <span class="fs-stat-value" style="color: #555">-</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Off</span>
    <span class="fs-stat-value" style="color: #555">-</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Extra</span>
    <span class="fs-stat-value" style="color: #555">-</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Missed</span>
    <span class="fs-stat-value" style="color: #555">-</span>
  </div>
  <div class="fs-stat">
    <span class="fs-stat-label">Total</span>
    <span class="fs-stat-value" style="color: #555">-</span>
  </div>
{/if}
