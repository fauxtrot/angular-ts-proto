


 


declare module DataAccess.Model {
interface Comment {
  Subject: string;
  MadeBy: DataAccess.Model.UserInfo;
  LikedBy: DataAccess.Model.UserInfo[];
  Body: string;
  Id: number;
}
interface UserInfo {
  Username: string;
  ProviderUserKey: number;
  NodeId: number;
}
}
