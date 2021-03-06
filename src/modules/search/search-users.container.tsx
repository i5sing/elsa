import * as React from 'react';
import { ImgCard } from "../../components";
import { IUser } from "../../interfaces";

export interface ISearchUsersProps {
    musicians: IUser[];
}

export class SearchUsers extends React.Component<ISearchUsersProps> {
    render() {
        const { musicians } = this.props;
        return <ImgCard count={4}>
            {musicians.map((musician: IUser) =>
                <ImgCard.Item
                    height={171.5}
                    key={musician.id}
                    title={musician.nickname}
                    img={musician.image}
                    onClick={() => location.hash = `#/musicians/${musician.id}`}
                />
            )}
        </ImgCard>;
    }
}
