const server = 'http://localhost:6969'

export const offersService = {
  getOffers: async () => {
    try {
      const res = await fetch(`${server}/api/v1/offers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  },
}
