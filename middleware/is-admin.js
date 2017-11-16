import isEmpty from 'lodash/isEmpty'

/**
 * Middleware to check if the current user is admin.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ store, redirect, error }) {
  const currentUser = store.state.currentUser
  if (!currentUser || isEmpty(currentUser)) {
    redirect(`/account/signin`)
  } else if (!currentUser.admin) {
    error({
      message: 'Forbidden',
      statusCode: 403
    })
  }
}
