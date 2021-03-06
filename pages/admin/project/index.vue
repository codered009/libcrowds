<template>
  <card-base :title="title" :description="description">

    <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
      <b-form-input
          v-model="searchString"
          class="search-control"
          size="sm"
          :placeholder="`Type to search by ${searchKeys.join(', ')}`">
        </b-form-input>
    </b-form>

    <b-button-toolbar
      key-nav
      justify
      :class="darkMode ? 'bg-dark border-bottom' : 'bg-light border-bottom'">
      <b-input-group  size="sm" class="m-1" prepend="Collection">
        <b-form-select
          :options="collectionOptions"
          v-model="collectionIdFilter"
          class="pr-3">
        </b-form-select>
      </b-input-group>
    </b-button-toolbar>

    <infinite-loading-table
      :fields="tableFields"
      :search-string="searchString"
      :search-keys="searchKeys"
      :search-params="{
        category_id: collectionIdFilter && collectionIdFilter > 0
          ? collectionIdFilter
          : null,
        published: collectionIdFilter !== 0,
        stats: 1,
        all: currentUser.admin ? 1 : 0
      }"
      domain-object="project">
      <template slot="action" slot-scope="row">
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-project-short_name-details',
            params: {
              short_name: row.item.short_name
            }
          }">
          Open
        </b-btn>
      </template>
    </infinite-loading-table>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Open Project',
      description: 'Manage your projects',
      searchString: null,
      searchKeys: ['name'],
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-lg-table-cell',
          sortable: true
        },
        'stats.overall_progress': {
          label: 'Progress',
          class: 'text-center d-none d-lg-table-cell'
        }
      },
      collectionIdFilter: null
    }
  },

  components: {
    InfiniteLoadingTable,
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    collectionOptions () {
      const items = this.$store.state.publishedCollections.map(collection => {
        return { text: collection.name, value: collection.id }
      })
      items.push({ text: 'Draft', value: 0 })
      return items
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
