type ErrorLabelProps = {
    message: string
}

export const ErrorLabel = (props: ErrorLabelProps) => {

    const {message} = props;

    return (
        <p className="text-xs font-normal text-red-500">
            {message}
        </p>
    );
};