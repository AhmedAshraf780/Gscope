const server = 'http://localhost:6969'

export const memberService = {
  getMembers: async (gym_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/members`, {
        credentials: 'include',
      })
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  },

  addMember: async (gym_id: number, name: string, phone: string, months: number, amount: number, notes: string) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/members`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id,
        }),
      })
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  },
}
