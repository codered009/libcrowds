<template>
  <card-base
    :title="title"
    :description="description"
    docs="/admin/announcements">

    <p slot="guidance">
      Use the form below to create a global announcement.
    </p>
    <hr class="my-1">

    <pybossa-form
      id="admin-announcement-new"
      show-cancel
      :form="form"
      @success="onSuccess"
      @cancel="onCancel">
    </pybossa-form>

  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import { metaTags } from '@/mixins/metaTags'
import VueFormGenerator from 'vue-form-generator'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'New Announcement',
      description: 'Make an announcement to all users.',
      form: {
        endpoint: '/api/announcement',
        method: 'post',
        model: pick(
          'title',
          'body',
          'info'
        ),
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Title',
              type: 'input',
              inputType: 'text',
              hint: 'Short titles work best (e.g. New Project Added!)',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'body',
              label: 'Content',
              type: 'input',
              inputType: 'text',
              hint: 'Add some additional details',
              required: true,
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'info.url',
              label: 'URL',
              type: 'input',
              inputType: 'url',
              required: true,
              placeholder: 'http://example.com',
              validator: VueFormGenerator.validators.url,
              hint: 'The URL to navigate to when the announcement is clicked'
            }
          ]
        }
      }
    }
  },

  components: {
    PybossaForm,
    ImageUploadForm,
    CardBase
  },

  methods: {
    /**
     * Handle success.
     * @param {Object} data
     *   The response data.
     */
    onSuccess (data) {
      this.$notifications.success({ message: 'Announcement created' })
      this.$router.push({
        name: 'admin-site-announcements-id',
        params: {
          id: data.id
        }
      })
    },

    /**
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-site-announcements' })
    }
  }
}
</script>
