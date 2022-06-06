import dayjs from "dayjs";

dayjs.locale("ja");

export const getNow = () => dayjs().format("YYYY-MM-DD");

export const getNowMs = () => dayjs().format("YYYY-MM-DD HH:mm");

export const getCreateBranchTime = () => dayjs().format("YYYY-MM-DD_HH-mm");
