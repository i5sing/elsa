import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { UserAction } from "../../actions/UserAction";
import { IUser } from "../../interfaces/IUser";
import { Layout } from "../../components/Layout";
import { Musician } from "../../components/Musician";
import { HeadBtn } from "../../components/HeadBtn";
import { MusicianSongs } from "./MusicianSongs";

export interface IMusicianProps {
    actions?: {
        user: typeof UserAction;
    };
    musician?: { [userId: string]: IUser };
    match?: {
        params: { musicianId: string, type: string }
    }
    userId?: string;
}

@connect(
    (state: IState) => ({
        musician: state.musician,
        userId: state.system.userId,
    }),
    (dispatch: Dispatch) => ({
        actions: {
            user: bindActionCreators(actions(UserAction), dispatch),
        }
    })
)
export class MusicianDetail extends React.Component<IMusicianProps> {
    componentDidMount(): void {
        const userId = this.props.match.params.musicianId;
        this.props.actions.user.getMusician(userId);
    }

    follow(user: IUser) {
        if (user.isFollow) {
            this.props.actions.user.unfollowUser(user.id + '');
        } else {
            this.props.actions.user.followUser(user.id + '');
        }
    }

    render() {
        const { musician, userId } = this.props;
        const musicianId = this.props.match.params.musicianId;
        const type = this.props.match.params.type;
        const user: IUser = musician[musicianId] || {
            id: -1,
            image: '',
            nickname: '',
            isFollow: false,
            description: ''
        };
        const headers = <span style={ { marginLeft: 20 } }>
            <HeadBtn to={ `/musicians/${ musicianId }/yc` }>原创</HeadBtn>
            <HeadBtn to={ `/musicians/${ musicianId }/fc` }>翻唱</HeadBtn>
            <HeadBtn to={ `/musicians/${ musicianId }/bz` }>伴奏</HeadBtn>
            <HeadBtn to={ `/musicians/${ musicianId }/activities` }>动态</HeadBtn>
            <HeadBtn to={ `/musicians/${ musicianId }/logs` }>留言</HeadBtn>
        </span>;
        return <Layout header={ headers } id="main">
            <Musician image={ user.image }
                      hideLike={ userId + '' === user.id + '' }
                      title={ user.nickname }
                      isLike={ user.isFollow }
                      onLike={ () => this.follow(user) }
                      description={ user.description }>
                { type === 'yc' ? <MusicianSongs type="yc" musicianId={ musicianId }/> : '' }
                { type === 'fc' ? <MusicianSongs type="fc" musicianId={ musicianId }/> : '' }
                { type === 'bz' ? <MusicianSongs type="bz" musicianId={ musicianId }/> : '' }
            </Musician>
        </Layout>
    }
}
