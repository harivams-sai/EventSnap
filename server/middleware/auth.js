import jwt from 'jsonwebtoken';

const auth = async ( req, res, next) => {
  try {
    if(req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      // const isCustomAuth = token.length < 500;
      // console.log(req.headers);
      let decodedData;

      if(token) {
        decodedData = jwt.verify(token, 'test');

        req.userId = decodedData?.id;
      }
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

export default auth;
