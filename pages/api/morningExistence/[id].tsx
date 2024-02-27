import type { NextApiRequest, NextApiResponse } from 'next'
import backendApiInstance from "../../../utils/backendApiInstance";
import getApiError from "../../../helpers/getApiError";

type Data = {
    morningExistenceData?: [],
    errorMessage?: string,
}

async function morningExistenceByIdHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    switch(req.method?.toUpperCase()) {
        case 'GET':
            try {
                const { id, date } = req.query;
                const { data } = await backendApiInstance.get('/morningExistence/' + id + `?date=${date}`);
                res.status(200).json(data)
            }
            catch(err) {
                await getApiError(res, err)
            }
            break;
        default:
            res.status(405).json({ errorMessage: 'Method not allowed' });
    }

}

export default morningExistenceByIdHandler;
