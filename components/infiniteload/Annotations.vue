<template>
  <no-ssr>
    <infinite-loading
      ref="infiniteload"
      class="infinite-loading"
      @infinite="infiniteLoadAnnotations">
      <span slot="no-results">
        <span v-if="noResults">{{ noResults }}</span>
      </span>
      <span slot="no-more">
        <span v-if="noMoreResults">{{ noMoreResults }}</span>
      </span>
    </infinite-loading>
  </no-ssr>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    containerIri: {
      type: String,
      required: true
    },
    noResults: {
      type: String,
      default: 'No results'
    },
    noMoreResults: {
      type: String,
      default: 'No more results'
    }
  },

  methods: {
    /**
     * Handler to infinitely load Annotations.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async infiniteLoadAnnotations ($state) {
      let response = null
      try {
        response = await this.$explicates.search({
          collection: this.containerIri,
          limit: 20,
          offset: this.value.length
        })
      } catch (err) {
        this.$nuxt.error(err)
      }

      if (!response.data.hasOwnProperty('first')) {
        $state.complete()
        this.$emit('complete')
        return
      }

      this.$emit('input', this.value.concat(response.data.first.items))
      $state.loaded()
    },

    /**
     * Reset the loaded items.
     */
    reset () {
      this.$emit('input', [])
      this.$nextTick(() => {
        this.page = 0
        this.$refs.infiniteload.$emit('$InfiniteLoading:reset')
      })
    },

    /**
     * Trigger a manual load.
     */
    load () {
      this.$nextTick(() => {
        if (!this.$refs.infiniteload.isLoading) {
          this.$refs.infiniteload.attemptLoad()
        }
      })
    }
  }
}
</script>