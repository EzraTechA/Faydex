// install.controller.js

import installService from "../services/install.service.js";

// Controller function
async function install(req, res, next) {
  try {
    const installMessage = await installService.install();
    if (installMessage.status === 200) {
      res.status(200).json({ message: installMessage });
    } else {
      res.status(500).json({ message: installMessage });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default  { install };
