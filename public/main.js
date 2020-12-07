import { MovieMatchAPI } from './MovieMatchAPI.js'
import { MovieCard } from './MovieCardView.js'
import { Matches } from './MatchesView.js'

const main = async () => {
  const CARD_STACK_SIZE = 4
  const user = await login()

  let api = new MovieMatchAPI(user)
  let matches = new Matches()

  api.addEventListener('match', e => matches.add(e.data))

  const rateControls = document.querySelector('.rate-controls')

  rateControls.addEventListener('click', e => {
    let wantsToWatch
    if (e.target.classList.contains('rate-thumbs-down')) {
      wantsToWatch = false
    } else if (e.target.classList.contains('rate-thumbs-up')) {
      wantsToWatch = true
    } else {
      return
    }

    document
      .querySelector('.js-card-list :first-child')
      .dispatchEvent(new MessageEvent('rate', { data: wantsToWatch }))
  })

  const cardStackEventTarget = new EventTarget()

  // here we're iterating an infinite (well, based on the size of your collection)
  // list of movies. The first CARD_STACK_SIZE cards will be rendered directly,
  // but for every card rendered after that we need a card to be dismissed.
  for await (let [movie, i] of api.getMovieListIterable()) {
    if (i > CARD_STACK_SIZE) {
      const response = await new Promise(resolve => {
        cardStackEventTarget.addEventListener(
          'response',
          e => {
            resolve(e.data)
          },
          {
            once: true,
          }
        )
      })
      api.respond(response)
    }

    new MovieCard(movie, cardStackEventTarget)
  }
}

export const login = async () => {
  const loginSection = document.querySelector('.login-section')
  const loginForm = document.querySelector('.js-login-form')

  let user = localStorage.getItem('user')

  if (user) {
    loginForm.elements.name.value = user
  }

  return new Promise(resolve => {
    const handleSubmit = async e => {
      e.preventDefault()
      const formData = new FormData(loginForm)
      const name = formData.get('name')
      if (name) {
        loginForm.removeEventListener('submit', handleSubmit)
        loginSection.hidden = true
        localStorage.setItem('user', name)
        document
          .querySelectorAll('.rate-section, .matches-section')
          .forEach(el => {
            el.hidden = false
          })
        return resolve(name)
      }
    }

    loginForm.addEventListener('submit', handleSubmit)
  })
}

main().catch(err => console.error(err))
