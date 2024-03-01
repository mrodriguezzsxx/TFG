import React, { useState } from 'react'

const useForm = (objectoI = {}) => {
  const [form, setForm] = useState(objectoI);
  
  const changed = ({target}) => {
    const {name,value} = target;

    setForm({
      ...form,
      [name]:value
    })
  }
  
  return {form, changed};
}

export default useForm