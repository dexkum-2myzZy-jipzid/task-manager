export interface Task {
  id?: string;
  title: string;
  done: boolean;
  createdBy: string; // user email
  createdAt: Date;
  lastUpdatedAt: Date;
  finishedAt: Date | null;
  imgUrl?: string;
}

export function createTask(
  title: string,
  userEmail: string,
  imgUrl: string
): Task {
  return {
    title,
    done: false,
    createdBy: userEmail, // Use the provided user email
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    finishedAt: null, // Assuming null as default, indicating not finished
    imgUrl: imgUrl, // Default empty string
  };
}
