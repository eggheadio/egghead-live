import React from 'react'

import loadable from "@loadable/component"

let EggheadChat = loadable(() => import("../components/EggheadChat"))


const IndexPage = () => {
  return <EggheadChat></EggheadChat>
}

export default IndexPage
