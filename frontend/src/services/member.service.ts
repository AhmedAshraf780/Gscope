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
          name,
          phone,
          months,
          price: amount,
          notes,
        }),
      })
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  },

  updateMember: async (gym_id: number, id: number, months: number, amount: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/members/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          months,
          price: amount,
        }),
      })
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  },

  addSession: async (
    gym_id: number,
    member_name: string,
    phone: string,
    session_type: string,
    price: number,
  ) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_name,
          phone,
          session_type,
          price,
          session_date: new Date().toISOString().slice(0, 10),
        }),
      })
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  },

  getSessions: async (gym_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/sessions`, {
        credentials: 'include',
      })
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }
  },
}
