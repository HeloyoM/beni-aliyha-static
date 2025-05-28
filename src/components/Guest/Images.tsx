import { IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Begin_1 from '../../temp/begin_1.jpg';
import Begin_2 from '../../temp/begin_2.jpg';
import Begin_3 from '../../temp/begin_3.jpg';
import Begin_4 from '../../temp/begin_4.jpg';
import Car from '../../temp/car.jpg';
import Shul_1 from '../../temp/shul_1.jpg';

const Images = () => {

    function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${width * cols}&h=${height * rows
                }&fit=crop&auto=format&dpr=2 2x`,
        };
    }

    return (
        <ImageList
            sx={{
                width: '100%',
                height: '100vh',
                // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                transform: 'translateZ(0)',
            }}
            rowHeight='auto'
            gap={1}
        >
            {itemData.map((item) => {
                const cols = item.featured ? 2 : 1;
                const rows = item.featured ? 2 : 1;

                return (
                    <ImageListItem key={item.img} cols={cols} rows={rows}>
                        <img
                            {...srcset(item.img, 800, 600, rows, cols)}
                            alt={item.title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            sx={{
                                background:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                            }}
                            title={item.title}
                            position="top"
                            actionIcon={
                                <IconButton
                                    sx={{ color: 'white' }}
                                    aria-label={`star ${item.title}`}
                                >
                                    <StarBorderIcon />
                                </IconButton>
                            }
                            actionPosition="left"
                        />
                    </ImageListItem>
                );
            })}
        </ImageList>

    )
}

export default Images;


const itemData = [
    {
        img: Begin_1,
        title: 'Beginning',
        author: '@bkristastucchio',
        featured: true,
    },
    {
        img: Begin_2,
        title: 'Beginning',
        author: '@rollelflex_graphy726',
    },
    {
        img: Begin_3,
        title: 'Beginning',
        author: '@helloimnik',
    },
    {
        img: Begin_4,
        title: 'Beginning',
        author: '@nolanissac',
    },
    {
        img: Car,
        title: 'Car',
        author: '@hjrc33',
    },
    {
        img: Shul_1,
        title: 'Shule',
        author: '@arwinneil',
        // featured: true,
    },
    {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
        author: '@tjdragotta',
    },
    {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
        author: '@katie_wasserman',
    },
    {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
        author: '@silverdalex',
    },
    {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
        author: '@shelleypauls',
    },
    {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
        author: '@peterlaster',
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
        author: '@southside_customs',
    },
];