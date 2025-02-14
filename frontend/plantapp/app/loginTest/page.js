"use client";

import { useState } from "react";

export default function LoginTest() {
  const [firstname, setFirstname] = useState('');
  const [userId, setUserId] = useState('');
  
  const jwt = localStorage.getItem('jwt');

  return (
    <h1>Hello</h1>
  );
}
