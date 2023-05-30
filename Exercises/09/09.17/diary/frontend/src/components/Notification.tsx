interface NotificationProps {
  notification: string
}
export const Notification = (props: NotificationProps): JSX.Element => {
  
  return (
    <div>
      <p>{props.notification}</p>
    </div>
  );
};